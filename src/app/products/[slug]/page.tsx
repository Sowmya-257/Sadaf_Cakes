import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/data";
import ProductForm from "@/components/ProductForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR cache revalidation

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="section-padding" style={{ textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>Cake Not Found</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
            The cake you are looking for does not exist or has been removed.
          </p>
          <Link href="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link href={`/categories/${product.category.slug}`} style={{ textDecoration: "none" }}>{product.category.name}</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--text-main)" }}>{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="detail-grid">
          {/* Left Column: Image */}
          <div className="detail-img-container">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 991px) 100vw, 600px"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Right Column: Info & Form */}
          <div className="detail-info">
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--primary-dark)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              {product.category.name}
            </span>
            <h1>{product.name}</h1>
            <div className="detail-price">AED {Number(product.price).toFixed(2)}</div>
            
            <p className="detail-desc">{product.description}</p>

            {/* Customization Form */}
            <ProductForm
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
                flavors: product.flavors,
                sizes: product.sizes,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
