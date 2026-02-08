/**
 * Redirect: Pipeline Products → Commerce Products
 *
 * Products/Catalog are managed in Commerce Hub (primary owner).
 * Pipeline Hub can add products to deals via Commerce.
 *
 * @see /commerce/products - Primary product catalog
 */
import { redirect } from 'next/navigation';

export default function PipelineProductsPage() {
  redirect('/commerce/products');
}
