package com.luxrental.entity.order;

import com.luxrental.entity.BaseEntity;
import com.luxrental.entity.device.Device;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class OrderDetail extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(name = "price_per_day", nullable = false, precision = 15, scale = 2)
    private BigDecimal pricePerDay;

    @Column(name = "deposit_amount", precision = 15, scale = 2)
    private BigDecimal depositAmount;
}
