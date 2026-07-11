package com.luxrental.service.common;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

@Component
public class PaginationHelper {

    public Pageable makeSafePagination(Pageable pageable, Set<String> allowedFields, String defaultSortField, Sort.Direction defaultDirection) {

        int page = pageable.getPageNumber();

        int size = pageable.getPageSize();

        if (size > 100) size = 100;

        Sort sort = pageable.getSort();

        Sort finalSort = Sort.unsorted(); // Originally set to Sort.unsorted()

        // Default Sorting:
        Sort defaultSort = Sort.by(defaultDirection != null ? defaultDirection : Sort.Direction.ASC,
            defaultSortField != null ? defaultSortField : "id");

        if (sort.isSorted()) {
            boolean isAllFieldsValid = true;

            // Check if all fields in the sort are allowed
            for (Sort.Order order : sort) {
                if (!allowedFields.contains(order.getProperty())) {
                    isAllFieldsValid = false;
                    break; // If any field is wrong, stop checking
                }
            }
            finalSort = isAllFieldsValid ? sort : defaultSort;

        } else {
            finalSort = defaultSort;
        }

        return PageRequest.of(page, size, finalSort);
    }
}
