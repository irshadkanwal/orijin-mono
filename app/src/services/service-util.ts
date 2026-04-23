import type { Farm } from "@/types/farm";
const rawEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;

const endpoint = (organisation: string): string => {
  return rawEndpoint + "/" + organisation;
};

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const appendFilters = (params, filters) => {
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          params.append(key, v);
        });
      } else {
        params.append(key, value);
      }
    }
  });
  return params;
};

export const genericPaginatedFetch = async <T>(
  organisation: string,
  controller: string,
  token?: string,
  page: number = 1,
  limit = 10,
  filters?: Record<string, string | string[]>
): Promise<{ data: Array<T>; count?: number }> => {
  const returnWhenError = { data: [], count: 0 };
  if (!organisation || organisation === "") {
    console.log(
      "WARN: genericPaginatedFetch attempted without organisation to " +
        controller
    );
    return returnWhenError;
  }

  const fullUrl = new URL(`${endpoint(organisation)}${controller}`);

  try {
    let params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (filters) {
      params = appendFilters(params, filters);
    }
    fullUrl.search = params.toString();
    const response = await fetch(fullUrl.toString(), {
      headers: getHeaders(token),
    });
    if (!response.ok) {
      console.error(
        `Failed to fetch ${fullUrl.toString()}: ${response.status} ${response.statusText}`
      );
      return returnWhenError;
    }

    return (await response?.json()) as { data: Array<T>; count?: number };
  } catch (error) {
    console.error(`Error fetching paginated ${controller}:`, error);
    return returnWhenError;
  }
};

export const genericSingleFetch = async <T>(
  organisation: string,
  controller: string,
  id: string = "",
  token?: string,
  filters?: Record<string, string | string[]>
): Promise<T | null> => {
  if (!organisation || organisation === "") {
    console.log(
      "WARN: genericSingleFetch attempted without organisation to " + controller
    );
    return null;
  }

  const fullUrl = new URL(`${endpoint(organisation)}${controller}/${id}`);
  try {
    let params = new URLSearchParams({});
    if (filters) {
      params = appendFilters(params, filters);
    }
    fullUrl.search = params.toString();
    const response = await fetch(fullUrl, {
      headers: getHeaders(token),
    });
    if (!response.ok) {
      console.error(
        `Failed to fetch ${controller}/${id}: ${response.status} ${response.statusText}`
      );
      return null;
    }
    return (await response?.json()) as Farm;
  } catch (error) {
    console.error(`Error fetching ${fullUrl}`, error);
    return null;
  }
};

/**
 * Only for authentication and similar global endpoints!
 *
 * @param controller
 * @param id
 * @param token
 */
export const genericSingleFetchWithoutOrganistaion = async <T>(
  controller: string,
  id: string = "",
  token?: string
): Promise<any> => {
  try {
    const response = await fetch(`${rawEndpoint}${controller}/${id}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) {
      console.error(
        `Failed to fetch ${controller}/${id}: ${response.status} ${response.statusText}`
      );
      return null;
    }
    return (await response?.json()) as Farm;
  } catch (error) {
    console.error(`Error fetching ${controller} with id ${id}`, error);
    return null;
  }
};

export const genericPaginatedFetchWithoutOrganistaion = async <T>(
  controller: string,
  token?: string,
  page: number = 1,
  limit = 10,
  filters?: Record<string, string | string[]>
): Promise<{ data: Array<T>; count?: number }> => {
  const returnWhenError = { data: [], count: 0 };
  try {
    const fullUrl = new URL(`${rawEndpoint}${controller}`);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              params.append(key, v);
            });
          } else {
            params.append(key, value);
          }
        }
      });
    }

    fullUrl.search = params.toString();
    const response = await fetch(fullUrl.toString(), {
      headers: getHeaders(token),
    });
    if (!response.ok) {
      console.error(
        `Failed to fetch ${controller}: ${response.status} ${response.statusText}`
      );
      return returnWhenError;
    }
    return (await response?.json()) as { data: Array<T>; count?: number };
  } catch (error) {
    console.error(`Error fetching paginated ${controller}:`, error);
    return returnWhenError;
  }
};

export const genericPostPutPatch = async <T>(
  organisation: string,
  controller: string,
  methodType: "POST" | "PUT" | "PATCH" | "DELETE",
  data: T,
  token?: string,
  contentType: "application/json" | "multipart/form-data" = "application/json"
): Promise<T | null> => {
  if (!organisation || organisation === "") {
    console.log(
      "WARN: genericPost attempted without organisation to " + controller
    );
    return null;
  }

  const headers: Record<string, string> = {
    "Content-Type": contentType,
  };

  if (contentType === "multipart/form-data") {
    delete headers["Content-Type"];
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const requestBody: RequestInit = {
    method: methodType.toUpperCase(),
    headers,
  };
  if (data) {
    requestBody.body =
      contentType === "multipart/form-data"
        ? (data as any)
        : JSON.stringify(data);
  }
  try {
    const response = await fetch(
      `${endpoint(organisation)}${controller}`,
      requestBody
    );
    if (!response.ok) {
      const responseBody = await response.text();
      const body: any = responseBody && JSON.parse(responseBody);
      console.error(
        `Failed to post to ${controller}: ${response.status} ${response.statusText} `
      );
      throw new Error(
        body?.error?.message ?? body?.message ?? response.statusText
      );
    }
    return (await response?.json()) as T;
  } catch (error: any) {

    throw new Error(error ?? "Something went wrong. Please try again.");
  }
};

export const genericPostPutPatchWithOutOrganization = async <T>(
  controller: string,
  methodType: "POST" | "PUT" | "PATCH" | "DELETE",
  data: T,
  token?: string
): Promise<T | null> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const requestBody: RequestInit = {
    method: methodType.toUpperCase(),
    headers,
  };
  if (data) {
    requestBody.body = JSON.stringify(data);
  }
  try {
    const response = await fetch(`${rawEndpoint}${controller}`, requestBody);
    if (!response.ok) {
      const responseBody = await response.text();
      const body: any = responseBody && JSON.parse(responseBody);
      console.error(
        `Failed to post to ${controller}: ${response.status} ${response.statusText} `
      );
      throw new Error(
        body?.error?.message ?? body?.message ?? response.statusText
      );
    }
    return (await response?.json()) as T;
  } catch (error: any) {
    console.error(`Error posting to ${controller}`, error);

    throw new Error(error ?? "Something went wrong. Please try again.");
  }
};

export const changesUserName = async (
  userId: String | undefined | null,
  newUsername: String | undefined | null,
  token?: string
) => {
  try {
    genericPostPutPatchWithOutOrganization(
      `/username/${userId}/`,
      "PUT",
      { username: newUsername },
      token
    );
  } catch (error) {
    console.log(error);
  }
};
