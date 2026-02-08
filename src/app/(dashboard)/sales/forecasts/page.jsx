/**
 * Redirect: Sales Forecasts → Pipeline Forecast
 *
 * Forecasting is managed in Pipeline Hub (primary owner).
 * Forecasts are tied to deals and pipeline metrics.
 *
 * @see /pipeline/forecast - Primary forecasting
 */
import { redirect } from 'next/navigation';

export default function SalesForecastsPage() {
  redirect('/pipeline/forecast');
}
