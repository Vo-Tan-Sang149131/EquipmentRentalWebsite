// @/features/product/components/detail/ProductSpecification.tsx

interface ProductSpecificationProps {
  label: string;
  value: string | number;
  isLast?: boolean;
}

export const ProductSpecification = ({ label, value, isLast }: ProductSpecificationProps) => {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      {!isLast && (
        <td className="py-3 font-medium text-gray-500 w-1/3">{label}</td>
      )}
      <td className="py-3 text-gray-900" colSpan={isLast ? 2 : 1}>
        {value}
      </td>
    </tr>
  );
};

