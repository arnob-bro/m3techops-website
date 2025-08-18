import { httpClient } from "./httpClient";
import { createAdminApi } from "./adminApi";

export const adminApi = createAdminApi(httpClient);
