import { apiClient, type ApiResponse } from "@/lib/api-client";

import { API_ROUTES } from "@/constants/routes";
import type { Page } from "@/types/common";
import type {
  AppointmentResponse,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "@/types/appointment";

export const appointmentService = {
  createAppointment: async (
    data: CreateAppointmentRequest,
  ): Promise<ApiResponse<AppointmentResponse>> => {
    const response = await apiClient.post<AppointmentResponse>(
      API_ROUTES.APPOINTMENTS.BASE,
      data,
    );
    return response;
  },

  updateAppointment: async (
    id: string,
    data: UpdateAppointmentRequest,
  ): Promise<ApiResponse<AppointmentResponse>> => {
    const response = await apiClient.put<AppointmentResponse>(
      API_ROUTES.APPOINTMENTS.BY_ID(id),
      data,
    );
    return response;
  },

  getAppointmentsByBranch: async (
    branchId: string,
    page = 0,
    size = 20,
  ): Promise<Page<AppointmentResponse>> => {
    const response = await apiClient.get<Page<AppointmentResponse>>(
      `${API_ROUTES.APPOINTMENTS.BY_BRANCH(branchId)}?page=${page}&size=${size}`,
    );
    return response.data!;
  },

  getAppointmentsByBusiness: async (
    businessId: string,
    page = 0,
    size = 20,
  ): Promise<Page<AppointmentResponse>> => {
    const response = await apiClient.get<Page<AppointmentResponse>>(
      `${API_ROUTES.APPOINTMENTS.BY_BUSINESS(businessId)}?page=${page}&size=${size}`,
    );
    return response.data!;
  },

  searchAppointments: async (
    branchId: string,
    search: string,
    startDate: string,
    endDate: string,
    status?: string | null,
    type?: string | null,
    page = 0,
    size = 20,
  ): Promise<Page<AppointmentResponse>> => {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      size: size.toString(),
    });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (status && status !== "ALL") params.append("status", status);
    if (type && type !== "ALL") params.append("type", type);

    const response = await apiClient.get<Page<AppointmentResponse>>(
      `${API_ROUTES.APPOINTMENTS.SEARCH(branchId)}?${params.toString()}`,
    );
    return response.data!;
  },

  searchAppointmentsByBusiness: async (
    businessId: string,
    search: string,
    startDate: string,
    endDate: string,
    status?: string | null,
    type?: string | null,
    page = 0,
    size = 20,
  ): Promise<Page<AppointmentResponse>> => {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      size: size.toString(),
    });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (status && status !== "ALL") params.append("status", status);
    if (type && type !== "ALL") params.append("type", type);

    // match the backend endpoint: /appointments/business/{businessId}/search
    const response = await apiClient.get<Page<AppointmentResponse>>(
      `${API_ROUTES.APPOINTMENTS.BY_BUSINESS(businessId)}/search?${params.toString()}`,
    );
    return response.data!;
  },

  getAppointmentById: async (id: string): Promise<AppointmentResponse> => {
    const response = await apiClient.get<AppointmentResponse>(
      API_ROUTES.APPOINTMENTS.BY_ID(id),
    );
    return response.data!;
  },

  updateStatus: async (
    id: string,
    status: AppointmentStatus,
  ): Promise<ApiResponse<AppointmentResponse>> => {
    const response = await apiClient.post<AppointmentResponse>(
      `${API_ROUTES.APPOINTMENTS.BY_ID(id)}/status`,
      { status },
    );
    return response;
  },

  deleteAppointment: async (id: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(API_ROUTES.APPOINTMENTS.BY_ID(id));
  },
};
