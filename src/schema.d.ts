/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/v1/station": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get all station data */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            metadata: {
                                /** @default true */
                                success: boolean;
                            };
                            data: components["schemas"]["Station"][];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/station/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get station by ID */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            metadata: {
                                /** @default true */
                                success: boolean;
                            };
                            data: components["schemas"]["Station"];
                        };
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            metadata: {
                                /** @default false */
                                success: boolean;
                                /** @default Not found */
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/schedule/{station_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get all schedule by station ID */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    station_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            metadata: {
                                /** @default true */
                                success: boolean;
                            };
                            data: components["schemas"]["Schedule"][];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/route/{train_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get sequence of station stop by train ID */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    train_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            metadata: {
                                /** @default true */
                                success: boolean;
                            };
                            data: components["schemas"]["Route"];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Station: {
            /** @example st_krl_mri */
            uid: string;
            /** @example MRI */
            id: string;
            /** @example MANGGARAI */
            name: string;
            /** @example KRL */
            type: string;
            /** @example {
             *       "active": true,
             *       "origin": {
             *         "daop": 1,
             *         "fg_enable": 1
             *       }
             *     } */
            metadata: {
                origin?: {
                    daop?: number | null;
                    fg_enable?: number | null;
                };
            };
            /**
             * Format: date-time
             * @example 2024-03-10T09:55:07.213Z
             */
            created_at: string;
            /**
             * Format: date-time
             * @example 2024-03-10T09:55:07.213Z
             */
            updated_at: string;
        };
        Schedule: {
            /**
             * @description Schedule unique ID
             * @example sc_krl_ac_2400
             */
            id: string;
            /**
             * @description Station ID where the train stops
             * @example AC
             */
            station_id: string;
            /**
             * @description Station ID where the train originates
             * @example JAKK
             */
            station_origin_id: string | null;
            /**
             * @description Station ID where the train terminates
             * @example TPK
             */
            station_destination_id: string | null;
            /**
             * @description Train ID
             * @example 2400
             */
            train_id: string;
            /**
             * @description Train line
             * @example COMMUTER LINE TANJUNGPRIUK
             */
            line: string;
            /**
             * @description Train route
             * @example JAKARTAKOTA-TANJUNGPRIUK
             */
            route: string;
            /**
             * Format: date-time
             * @description Train departure time
             * @example 2024-03-10T09:55:07.213Z
             */
            departs_at: string;
            /**
             * Format: date-time
             * @description Train arrival time at destination
             * @example 2024-03-10T09:55:09.213Z
             */
            arrives_at: string;
            /** @example {
             *       "origin": {
             *         "color": "#DD0067"
             *       }
             *     } */
            metadata: {
                origin?: {
                    color?: string | null;
                };
            };
            /**
             * Format: date-time
             * @example 2024-03-10T09:55:07.213Z
             */
            created_at: string;
            /**
             * Format: date-time
             * @example 2024-03-10T09:55:07.213Z
             */
            updated_at: string;
        };
        Route: {
            routes: {
                /**
                 * @description Schedule unique ID
                 * @example sc_krl_ac_2400
                 */
                id: string;
                /**
                 * @description Station ID where the train stops
                 * @example AC
                 */
                station_id: string;
                /** @example ANCOL */
                station_name: string;
                /**
                 * Format: date-time
                 * @description Train departure time
                 * @example 2024-03-10T09:55:07.213Z
                 */
                departs_at: string;
                /**
                 * Format: date-time
                 * @example 2024-03-10T09:55:07.213Z
                 */
                created_at: string;
                /**
                 * Format: date-time
                 * @example 2024-03-10T09:55:07.213Z
                 */
                updated_at: string;
            }[];
            details: {
                /**
                 * @description Train ID
                 * @example 2400
                 */
                train_id: string;
                /**
                 * @description Train line
                 * @example COMMUTER LINE TANJUNGPRIUK
                 */
                line: string;
                /**
                 * @description Train route
                 * @example JAKARTAKOTA-TANJUNGPRIUK
                 */
                route: string;
                /**
                 * @description Station ID where the train originates
                 * @example JAKK
                 */
                station_origin_id: string | null;
                /** @example JAKARTAKOTA */
                station_origin_name: string;
                /**
                 * @description Station ID where the train terminates
                 * @example TPK
                 */
                station_destination_id: string | null;
                /** @example TANJUNGPRIUK */
                station_destination_name?: string;
                /**
                 * Format: date-time
                 * @description Train arrival time at destination
                 * @example 2024-03-10T09:55:09.213Z
                 */
                arrives_at: string;
            };
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;