import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from '../entities/utils/ObjectId';
import { FirestoreOrmService } from './firestoreOrm.service';
import OrganisationConfig from '../entities/org/OrganisationConfiguration';
import { OrmOptions } from '../entities/utils/utils';
import { FirestoreWorkspaceService } from './firestoreWorkspace.service';
import Workspace from '../entities/org/Workspace';

@Injectable()
export class FirestoreOrganisationConfig {
  logger = new Logger(FirestoreOrganisationConfig.name);

  constructor(
    private readonly firestoreOrmService: FirestoreOrmService,
    private readonly firestoreWorkspaceService: FirestoreWorkspaceService,
  ) { }

  async getOrganisationConfig(org: ObjectId) {
    try {
      const organisationConfig = await this.firestoreOrmService.getById(
        org.id,
        OrganisationConfig,
      );
      if (!organisationConfig) {
        return {} as OrganisationConfig;
      }
      return organisationConfig;
    } catch (error) {
      this.logger.error('Error retrieving document:', error);
      throw new InternalServerErrorException('Failed to retrieve document');
    }
  }

  async updateOrganisationConfig(
    org: ObjectId,
    data: any,
    dbOps: OrmOptions,
  ): Promise<any> {
    let commitHere = false;

    if (!dbOps.tx) {
      dbOps.tx = this.firestoreOrmService.getTransaction();
      commitHere = true;
    }

    const currentConfig = await this.firestoreOrmService.getById(org.id, OrganisationConfig);
    if (!currentConfig) {
      throw new NotFoundException('Document does not exist');
    }

    try {
      if (data.locality) {
        currentConfig.config.locality = data.locality;
      }

      if (data.general) {
        const workspaces = await this.firestoreWorkspaceService.getAllWorkspaceByOrganisationId(
          org.id
        );

        if (data.general.masterWorkspace) {
          data.general.masterWorkspace = this.getValidWorkspaceId(workspaces as Workspace[], data.general.masterWorkspace);
        }

        if (data.general.testWorkspace) {
          data.general.testWorkspace = this.getValidWorkspaceId(workspaces as Workspace[], data.general.testWorkspace);
        }

        currentConfig.config.general = data.general;
      }

      await this.firestoreOrmService.update(currentConfig, dbOps);

      if (commitHere) {
        await this.firestoreOrmService.commit(dbOps.tx);
      }

      return currentConfig;

    } catch (error) {
      this.logger.error('Error updating document:', error);
      throw new InternalServerErrorException('Failed to update document');
    }
  }

  private getValidWorkspaceId(workspaces: Workspace[], workspaceId: string): string {
    const foundWorkspace = workspaces.find(
      (workspace) => workspace?.properties?.customId.toLowerCase() === workspaceId.toLowerCase()
    );
    return foundWorkspace ? foundWorkspace.properties.customId : workspaceId;
  }
}
