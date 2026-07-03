package com.example.demo.security.oauth2;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserSocialAccount;
import com.example.demo.enumValues.RoleType;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.user.RoleRepository;
import com.example.demo.repository.user.UserRepository;
import com.example.demo.repository.user.UserSocialAccountRepository;
import com.example.demo.security.normal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserSocialAccountRepository socialAccountRepository;
    private final DefaultOAuth2UserService defaultUserService = new DefaultOAuth2UserService();

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = defaultUserService.loadUser(userRequest);
//        log.info("OAuth2 provider = {}", userRequest.getClientRegistration().getRegistrationId());
//        String currentEmail = oAuth2User.getAttribute("email");
//        log.info("OAuth2 email = {}", currentEmail);

        String provider = userRequest.getClientRegistration().getRegistrationId().toUpperCase();
        String providerUserId = null;
        String avatarUrl = null;

        if ("GOOGLE".equals(provider)) {
            // Identifier of Google user is the 'sub' attribute
            providerUserId = oAuth2User.getAttribute("sub");
            avatarUrl = oAuth2User.getAttribute("picture");

        } else if ("FACEBOOK".equals(provider)) {
            // Identifier of Facebook user is the 'id' attribute
            providerUserId = oAuth2User.getAttribute("id");

            Object pictureAttr = oAuth2User.getAttribute("picture");

            // Check if the response contains the 'picture' attribute
            if (pictureAttr instanceof Map<?, ?> pictureObj && pictureObj.get("data") instanceof Map<?, ?> dataObj) {
                avatarUrl = (String) dataObj.get("url");
            }

            // Fallback to the old Facebook API if 'picture' is not available
            if (avatarUrl == null && providerUserId != null) {
                avatarUrl = "https://facebook.com" + providerUserId + "/picture?type=large";
            }


        }

        String email = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");

        if (email == null) {
            throw new OAuth2AuthenticationException("Không tìm thấy email từ nhà cung cấp: " + provider);
        }

        User user = processUserAuthentication(provider, providerUserId, email, fullName, avatarUrl); //
        return new CustomUserDetails(user, oAuth2User.getAttributes()); // Use to retrieve payload from OAuth2 authentication
    }


    private User processUserAuthentication(String provider, String providerUserId, String email, String fullName, String avatarUrl) {
        // Case1: Check if that social id is already registered in the system
        Optional<User> userBySocial = userRepository.findBySocialProviderAndUserId(provider, providerUserId);
        if (userBySocial.isPresent()) {
            log.info("Người dùng cũ đăng nhập lại qua Social: {}", email);
            return userBySocial.get();
        }

        // Case 2: If not, check if the email is already registered then link the social account
        Optional<User> userByEmail = userRepository.findByEmail(email);
        if (userByEmail.isPresent()) {
            User existingUser = userByEmail.get();
            log.info("Email đã tồn tại. Tiến hành liên kết tài khoản Social mới cho: {}", email);

            // Tạo liên kết mới sang bảng phụ user_social_accounts cho user này
            linkSocialAccount(existingUser, provider, providerUserId, avatarUrl);
            return existingUser;
        }

        // Case 3: If neither, create a new user
        log.info("Tạo người dùng hoàn toàn mới từ luồng OAuth2: {}", email);
        return createNewOAuth2User(provider, providerUserId, email, fullName, avatarUrl);
    }

    private User createNewOAuth2User(String provider, String providerUserId, String email, String fullName, String avatarUrl) {
        // Set new user's default role (RENTER)'
        Role defaultRole = roleRepository.findByRole(RoleType.RENTER)
            .orElseThrow(() -> new AppException(ErrorCode.DEFAULT_ROLE_NOT_FOUND));

        // Auto generate username based on email
        String baseUsername = email.split("@")[0];
        String generatedUsername = baseUsername;
        int suffix = 1;
        while (userRepository.existsByUsername(generatedUsername)) {
            generatedUsername = baseUsername + suffix;
            suffix++;
        }

        //  Create a new user with a password and phone number set to null,
        //  and we will require the user to update it later
        User newUser = User.builder()
            .username(generatedUsername)
            .password(null) // null password for OAuth2 users
            .fullName(fullName != null ? fullName : baseUsername)
            .email(email)
            .phoneNumber(null)
            .trustScore(new BigDecimal("5.00"))
            .roles(Set.of(defaultRole))
            .enabled(true)
            .build();

        User savedUser = userRepository.save(newUser);

        // Create a new UserSocialAccount record
        linkSocialAccount(savedUser, provider, providerUserId, avatarUrl);

        return savedUser;
    }

    private void linkSocialAccount(User user, String provider, String providerUserId, String avatarUrl) {
        UserSocialAccount socialAccount = UserSocialAccount.builder()
            .user(user)
            .provider(provider)
            .providerUserId(providerUserId)
            .avatarUrl(avatarUrl)
            .build();
        socialAccountRepository.save(socialAccount);
    }
}
