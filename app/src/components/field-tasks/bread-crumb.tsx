import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "../icons";
import { FieldTaskQuery } from "@/types/field-task";

export type Workspace = {
  workspaceName: string;
  collections: string[];
};

type FieldTasksBreadCrumbProps = {
  workspaces: Workspace[];
  search: FieldTaskQuery;
  onNavigate: (workspace: string, collection: string) => void;
};

export function FieldTasksBreadCrumb({
  workspaces,
  search,
  onNavigate,
}: FieldTasksBreadCrumbProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    search["workspace"] || null
  );
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    search["collection"] || null
  );

  // Get collections based on the selected workspace
  const collections = selectedWorkspace
    ? workspaces.find((ws) => ws.workspaceName === selectedWorkspace)
        ?.collections ?? []
    : [];

  const handleWorkspaceSelect = (workspace: string) => {
    setSelectedWorkspace(workspace);
    setSelectedCollection(null);
    onNavigate(workspace, "");
  };

  const handleCollectionSelect = (collection: string) => {
    setSelectedCollection(collection);
    if (selectedWorkspace) {
      onNavigate(selectedWorkspace, collection);
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbSeparator>
          <Icons.slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <WorkspaceDropdown
            workspaces={workspaces}
            selectedWorkspace={selectedWorkspace}
            onWorkspaceSelect={handleWorkspaceSelect}
          />
        </BreadcrumbItem>
        {selectedWorkspace && (
          <>
            <BreadcrumbSeparator>
              <Icons.slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <CollectionDropdown
                collections={collections}
                selectedCollection={selectedCollection}
                onCollectionSelect={handleCollectionSelect}
              />
            </BreadcrumbItem>
          </>
        )}
        {selectedCollection && (
          <>
            <BreadcrumbSeparator>
              <Icons.arrowRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>
                {selectedWorkspace}/{selectedCollection}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

type WorkspaceDropdownProps = {
  workspaces: Workspace[];
  selectedWorkspace: string | null;
  onWorkspaceSelect: (workspaceName: string) => void;
};

function WorkspaceDropdown({
  workspaces,
  selectedWorkspace,
  onWorkspaceSelect,
}: WorkspaceDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-base">
        <span>{selectedWorkspace ?? "Select Workspace"} </span>
        <Icons.chevronDown className="w-4" />
        <span className="sr-only">Toggle menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.workspaceName}
            onClick={() => onWorkspaceSelect(workspace.workspaceName)}
          >
            {workspace.workspaceName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type CollectionDropdownProps = {
  collections: string[];
  selectedCollection: string | null;
  onCollectionSelect: (collectionName: string) => void;
};

function CollectionDropdown({
  collections,
  selectedCollection,
  onCollectionSelect,
}: CollectionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-base">
        <span>{selectedCollection ?? "Select Collection"}</span>
        <Icons.chevronDown className="w-4" />
        <span className="sr-only">Toggle menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {collections.map((collection) => (
          <DropdownMenuItem
            key={collection}
            onClick={() => onCollectionSelect(collection)}
          >
            {collection}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
