package com.luxrental.repository.review;

import com.luxrental.entity.user.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReviewRepository extends JpaRepository<UserReview, Long> {

    @Query("SELECT AVG(ur.rating) FROM UserReview ur WHERE ur.renter.id = :renterId")
    Double getAverageRatingByRenterId(@Param("renterId") Long renterId);
}
