import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8">
      <p className="text-2xl md:text-3xl font-medium text-center md:text-left mb-6 md:mb-8">
        Best Sellers
      </p>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
