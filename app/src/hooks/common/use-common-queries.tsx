import { lastPathSegments, SearchFrom } from "@/config/rootKeys";
import { resetPasswordRequest } from "@/services/auth-service";
import {
  deleteById,
  deleteMultiple,
  fetchAllQueryOptions,
  post,
  update,
} from "@/services/common-service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";

export const useCommonQuery = ({
  rootKey,
  search,
  path,
}: {
  rootKey: SearchFrom;
  search: any;
  path: string;
}) => {
  const {
    auth: { organisations, currentUser },
  } = useRouteContext({ from: rootKey as any });
  let organisation = "";
  if (path !== lastPathSegments.ORGANISATIONS) {
    organisation = organisations.current;
  }

  const fetchData = useSuspenseQuery(
    fetchAllQueryOptions(organisation, path, search, currentUser?.accessToken)
  );

  const add = async (data: any) => {
    const response = await post(
      organisation,
      path,
      data,
      currentUser?.accessToken
    );
    fetchData.refetch();
    return response;
  };

  const edit = async (data: any) => {
    const id =
      path === lastPathSegments.ORGANISATIONS || path === lastPathSegments.USERS
        ? data.id.id
        : data.id;
    const response = await update(
      organisation,
      path,
      id,
      data,
      currentUser?.accessToken
    );
    fetchData.refetch();
    return response;
  };

  const deleteRowById = async (id: string) => {
    const response = await deleteById(
      organisation,
      path,
      id,
      currentUser?.accessToken
    );
    fetchData.refetch();
    return response;
  };

  const resetPassword = async (email: string) => {
    const response = await resetPasswordRequest(
      { email },
      currentUser?.accessToken
    );
    return response;
  };

  const deleteRows = async (data: any) => {
    const response = await deleteMultiple(
      organisation,
      path,
      data,
      currentUser?.accessToken
    );
    fetchData.refetch();
    return response;
  };

  const updateRows = async (data: any) => {
    const response = await update(
      organisation,
      path,
      "",
      data,
      currentUser?.accessToken
    );
    fetchData.refetch();
    return response;
  };

  return {
    fetchData,
    add,
    edit,
    deleteRowById,
    resetPassword,
    deleteRows,
    updateRows,
  };
};
