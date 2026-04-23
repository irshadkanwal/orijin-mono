import { PDelegate } from './dto/types';
import {
  isValidImportString,
  parseDateForImport,
} from './service/AbstractService';

export async function setupDependencyBasedOnShortCodeOrId<
  E extends PDelegate<any, any, any, any, any>,
>(
  name: string,
  findManyPrismaDelegate: E,
  code: string,
  id: string,
  organisation: string,
  mandatory: boolean,
  isUpdate: boolean,
  updateData: any,
) {
  let returnId = undefined;
  const idKey = name + 'Id';
  const codeKey = name + 'Code';

  delete updateData[idKey];
  delete updateData[codeKey];
  delete updateData[name];

  if (!isValidImportString(id) && !isValidImportString(code)) {
    if (mandatory) {
      throw new Error(
        name + ' mandatory dep but nothing provided ' + (id || code),
      );
    }
  } else {
    const items = await findManyPrismaDelegate.findMany({
      where: {
        AND: [
          { organisation: organisation },
          {
            OR: [{ id: id }, { shortCode: code }],
          },
        ],
      },
    });

    if (mandatory) {
      if (items.length !== 1) {
        console.error(name + ' not found for code/id: ' + (id || code), items);
        throw new Error(name + ' not found for code/id: ' + (id || code));
      }
    }

    if (items.length > 0) {
      returnId = items[0].id;
    }
  }

  if (isUpdate) {
    updateData[idKey] = returnId;
    updateData[name] = undefined;
  } else {
    updateData[idKey] = undefined;
    if (returnId) {
      updateData[name] = {
        connect: { id: returnId },
      };
    }
  }
}
