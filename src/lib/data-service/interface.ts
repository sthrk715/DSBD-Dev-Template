import type {
  DashboardQueryParams,
  ExecutiveData,
  ChannelsData,
  SubscriptionData,
  CustomersData,
  AccessData,
  GiftsData,
  GiftsQueryParams,
  ProductsData,
  EmailData,
  TimeseriesData,
  TimeseriesQueryParams,
} from './types'

export interface DashboardDataService {
  getExecutive(params: DashboardQueryParams): Promise<ExecutiveData>
  getChannels(params: DashboardQueryParams): Promise<ChannelsData>
  getSubscription(params: DashboardQueryParams): Promise<SubscriptionData>
  getCustomers(params: DashboardQueryParams): Promise<CustomersData>
  getAccess(params: DashboardQueryParams): Promise<AccessData>
  getGifts(params: GiftsQueryParams): Promise<GiftsData>
  getProducts(params: DashboardQueryParams): Promise<ProductsData>
  getEmail(params: DashboardQueryParams): Promise<EmailData>
  getTimeseries(params: TimeseriesQueryParams): Promise<TimeseriesData>
}
