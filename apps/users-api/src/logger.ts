import { createLogger } from "@competition-manager/backend-utils";
import { SERVICE } from "@competition-manager/schemas";

export const logger = createLogger(SERVICE.USERS);