"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DISPLAY_DEF", {
    enumerable: true,
    get: function() {
        return DISPLAY_DEF;
    }
});
const DISPLAY_DEF = {
    displayDefs: {
        procurementComplete: {
            source: 'prodlots',
            name: 'procurementComplete',
            ordering: [
                {
                    key: 'createdDate',
                    direction: 'desc'
                }
            ],
            dataFetchOptions: {
                expandChildren: true,
                applyAC: true
            },
            transformations: [
                {
                    jstransform: 'procurementCompleteWithTransport'
                }
            ],
            filters: [
                {
                    key: 'currentState',
                    operation: '==',
                    value: 'COLLECTING'
                }
            ],
            columns: [
                {
                    title: 'label',
                    value: 'id.chainLabel',
                    filtering: true,
                    primary: true,
                    defaultSize: 'md'
                },
                {
                    title: 'date',
                    valueJsonata: '$datetime(startDate)'
                },
                {
                    title: 'season',
                    valueJsonata: 'season.label'
                },
                {
                    title: 'transportStatus',
                    filtering: true,
                    defaultSize: 'sm',
                    value: 'transportStatus'
                },
                {
                    title: 'approvalStatus',
                    value: 'approvalStatus'
                },
                {
                    title: 'purchaseStatus',
                    value: 'purchaseStatus'
                },
                {
                    title: 'paymentStatus',
                    value: 'paymentStatus',
                    filtering: true,
                    defaultSize: 'sm'
                },
                {
                    title: 'currentLocation',
                    filtering: false,
                    valueJsonata: 'processingProperties.properties.toFacility.label'
                },
                {
                    title: 'beforeWeight',
                    valueJsonata: '$formatWeightForUi(processingProperties.beforeWeight)'
                },
                {
                    title: 'afterWeight',
                    valueJsonata: '$formatWeightForUi(processingProperties.afterWeight)'
                },
                {
                    title: 'sackCountBefore',
                    valueJsonata: 'processingProperties.sackCountBefore'
                },
                {
                    title: 'sackCountAfter',
                    valueJsonata: 'processingProperties.sackCountAfter'
                },
                {
                    title: 'weightLossInTransport',
                    valueJsonata: "$round(-((processingProperties.afterWeight-processingProperties.beforeWeight)/ processingProperties.beforeWeight )*100,2)  & '%'"
                },
                {
                    title: 'weightLossPaybackKg',
                    valueJsonata: 'weightLossPaybackKg'
                },
                {
                    title: 'weightLossPaybackMoney',
                    valueJsonata: 'weightLossPaybackMoney'
                },
                {
                    title: 'sackLoss',
                    valueJsonata: '-(processingProperties.sackCountAfter - processingProperties.sackCountBefore)'
                },
                {
                    title: 'weightBeforeFermentation',
                    valueJsonata: '$formatWeightForUi(processingProperties.properties.weightAtReception)'
                },
                {
                    title: 'sackCountBeforeFermentation',
                    valueJsonata: 'processingProperties.properties.sackCountAtReception'
                },
                {
                    title: 'paid',
                    filtering: false,
                    valueJsonata: '$round(processingProperties.money.amount,2)',
                    sortingKey: 'processingProperties.money.amount'
                },
                {
                    title: 'user',
                    value: 'createdBy.email'
                },
                {
                    title: 'transportRecords',
                    value: 'id',
                    widget: 'renderTemplateNew',
                    sorting: false,
                    filtering: false,
                    properties: {
                        largePopup: true,
                        objectAsTemplateContext: true,
                        templateSelection: 'this',
                        templateId: 'transportRecords',
                        noPrintButton: true
                    }
                },
                {
                    title: 'activityLogs',
                    value: 'id',
                    widget: 'renderReactTemplate',
                    properties: {
                        largePopup: true,
                        objectAsTemplateContext: true,
                        noPrintButton: true,
                        templateSelection: 'this',
                        templateId: 'entityActivityLogs2'
                    }
                },
                {
                    title: 'traceReport',
                    value: 'id',
                    widget: 'renderTemplateNew',
                    properties: {
                        templateId: 'trace_prodlot_postharvest_designed',
                        saveResultToStorage: false,
                        largePopup: true
                    }
                },
                {
                    title: 'notes',
                    value: 'id',
                    widget: 'renderTemplate',
                    sorting: false,
                    filtering: false,
                    properties: {
                        colDisplayCondition: '$count(entity.noteItems)>0',
                        colDisplayValue: "$ellipse($join(entity.noteItems.note, ', '), 30)",
                        objectAsTemplateContext: true,
                        templateSelection: 'this',
                        templateId: 'notes',
                        noPrintButton: true
                    }
                },
                {
                    title: 'variety',
                    value: 'processingProperties.properties.variety.label',
                    filtering: true,
                    optional: true
                },
                {
                    title: 'location',
                    value: 'processingProperties.properties.location.label',
                    filtering: true
                },
                {
                    title: 'locationCode',
                    value: 'processingProperties.properties.location.labelShort',
                    filtering: true
                },
                {
                    title: 'locationParent',
                    value: 'processingProperties.properties.locationParent.label',
                    filtering: true
                },
                {
                    title: 'locationParentCode',
                    value: 'processingProperties.properties.locationParent.labelShort',
                    filtering: true
                },
                {
                    title: 'facility',
                    value: 'processingProperties.properties.facility.label',
                    filtering: true
                },
                {
                    title: 'facilityCode',
                    value: 'processingProperties.properties.facility.labelShort',
                    filtering: true
                },
                {
                    title: 'createdLocationLat',
                    value: 'createdLocation.latLong.lat'
                },
                {
                    title: 'createdLocationLon',
                    value: 'createdLocation.latLong.lon'
                }
            ],
            sourceActivities: {},
            entityActivities: {
                deleteLot: {
                    roles: [
                        'admin',
                        'superuser'
                    ],
                    type: 'DeleteProdlot',
                    name: 'deleteLot',
                    method: 'update',
                    variables: [
                        {
                            name: 'id',
                            type: 'displayObject',
                            isUpdateSelectionField: true,
                            defaultValue: '#JSONATA#targetEntity.id',
                            disable: true,
                            properties: {
                                label: 'chainLabel'
                            },
                            submitReview: {
                                noDisplay: false
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        }
                    ],
                    id: 'deleteLot'
                },
                approveAndCloseLot: {
                    rowConditionsForRoles: [
                        {
                            rowCondition: "entity.approvalStatus='NotSet'",
                            roles: [
                                'admin',
                                'FinancialOfficer',
                                'FinancialManager'
                            ]
                        }
                    ],
                    type: 'ProcessProdLot',
                    rowCondition: "entity.systemState='Open'",
                    method: 'action',
                    options: {
                        closeRelatedPendingTasks: true,
                        setStatusTo: [
                            {
                                statusType: 'approvalStatus',
                                value: 'Approved',
                                current: true,
                                applyToAcs: true
                            },
                            {
                                statusType: 'systemState',
                                value: 'Closed',
                                current: true,
                                applyToAcs: true
                            },
                            {
                                statusType: 'modificationStatus',
                                value: 'Closed',
                                current: true,
                                applyToAcs: true
                            }
                        ]
                    },
                    variables: [
                        {
                            name: 'sourceProdLot',
                            label: 'lot',
                            type: 'displayObject',
                            properties: {
                                label: 'id.chainLabel'
                            },
                            isRowId: true,
                            copyToParent: true,
                            submitReview: {
                                expression: 'sourceProdLot.chainLabel'
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'activityStartDateTime',
                            label: 'datetime',
                            type: 'datetime',
                            defaultValue: '<newdate>',
                            properties: {
                                allowPast: true
                            },
                            fieldType: {
                                name: 'datetime',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'date'
                                },
                                id: 'datetime',
                                inputFieldType: 'datetime'
                            }
                        },
                        {
                            name: 'approved',
                            type: 'yesNo',
                            submitReview: {
                                displayWidgetTypeJsonata: 'boolean'
                            },
                            fieldType: {
                                name: 'yesNo',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'boolean',
                                    _nullable: true
                                },
                                inputFieldType: 'yesNo',
                                id: 'yesNo'
                            }
                        },
                        {
                            name: 'noteForProdLot',
                            label: 'note',
                            type: 'text',
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        }
                    ],
                    id: 'approveAndCloseLot',
                    name: 'approveAndCloseLot'
                },
                undoApproveAndCloseLot: {
                    rowConditionsForRoles: [
                        {
                            rowCondition: "entity.approvalStatus='Approved'",
                            roles: [
                                'admin',
                                'FinancialOfficer',
                                'FinancialManager'
                            ]
                        }
                    ],
                    type: 'ProcessProdLot',
                    method: 'action',
                    rowCondition: "entity.approvalStatus='Approved'",
                    options: {
                        undoCloseRelatedPendingTasks: true,
                        setStatusTo: [
                            {
                                statusType: 'approvalStatus',
                                value: 'NotSet',
                                current: true,
                                applyToAcs: true
                            },
                            {
                                statusType: 'systemState',
                                value: 'Open',
                                current: true,
                                applyToAcs: true
                            },
                            {
                                statusType: 'modificationStatus',
                                value: 'CanModify',
                                current: true,
                                applyToAcs: true
                            }
                        ]
                    },
                    variables: [
                        {
                            name: 'sourceProdLot',
                            label: 'lot',
                            type: 'displayObject',
                            properties: {
                                label: 'id.chainLabel'
                            },
                            isRowId: true,
                            copyToParent: true,
                            submitReview: {
                                expression: 'sourceProdLot.chainLabel'
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'noteForProdLot',
                            label: 'note',
                            type: 'text',
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        }
                    ],
                    id: 'undoApproveAndCloseLot',
                    name: 'undoApproveAndCloseLot'
                }
            }
        },
        collectionItemsReport: {
            source: 'lotsections',
            name: 'collectionItemsReport',
            dataFetchOptions: {
                applyAC: true
            },
            ordering: [
                {
                    key: 'startDate',
                    direction: 'desc'
                }
            ],
            filters: [
                {
                    key: 'activityName',
                    operation: '==',
                    value: 'collectCacaoFromFarmer'
                }
            ],
            columns: [
                {
                    title: 'label',
                    value: 'processingProperties.properties.sourceProdLot.chainLabel',
                    filtering: true,
                    defaultSize: 'lg'
                },
                {
                    title: 'producer',
                    value: 'producer.label',
                    defaultSize: 'md',
                    filtering: true
                },
                {
                    title: 'code',
                    value: 'producer.labelShort',
                    filtering: true
                },
                {
                    title: 'location',
                    value: 'processingProperties.properties.location.label',
                    filtering: true
                },
                {
                    title: 'locationParent',
                    value: 'processingProperties.properties.locationParent.label',
                    filtering: true
                },
                {
                    title: 'facility',
                    value: 'processingProperties.properties.facility.label',
                    filtering: true
                },
                {
                    title: 'beforeWeight',
                    label: 'weight',
                    value: 'processingProperties.beforeWeight',
                    widget: 'weight',
                    filtering: false,
                    properties: {
                        unit: 'kg',
                        rounding: true,
                        roundingAccuracy: 2,
                        showUnit: false
                    }
                },
                {
                    title: 'afterWeight',
                    value: 'processingProperties.afterWeight',
                    filtering: false,
                    widget: 'weight',
                    properties: {
                        unit: 'kg'
                    }
                },
                {
                    title: 'money',
                    filtering: false,
                    sortingKey: 'paymentAmount.amount',
                    valueJsonata: '$round(paymentAmount.amount,2)'
                },
                {
                    title: 'price',
                    filtering: false,
                    defaultSize: 'sm',
                    valueJsonata: 'processingProperties.properties.pricePerUnitString'
                },
                {
                    title: 'sackCount',
                    sorting: false,
                    filtering: false,
                    value: 'processingProperties.properties.sackCountBefore'
                },
                {
                    title: 'sackCountAfter',
                    sorting: false,
                    filtering: false,
                    value: 'processingProperties.properties.sackCountAfter'
                },
                {
                    title: 'brix',
                    sorting: false,
                    filtering: false,
                    value: 'processingProperties.properties.brix'
                },
                {
                    title: 'moistureContent',
                    sorting: false,
                    filtering: false,
                    value: 'processingProperties.properties.moistureContent'
                },
                {
                    title: 'receiptNumber',
                    filtering: true,
                    value: 'processingProperties.properties.receiptNumber'
                },
                {
                    title: 'collectionId',
                    filtering: true,
                    value: 'processingProperties.properties.collectionId',
                    defaultSize: 'sm'
                },
                {
                    title: 'season',
                    valueJsonata: 'processingProperties.properties.season.label'
                },
                {
                    title: 'paymentType',
                    valueJsonata: 'paymentType',
                    filtering: true
                },
                {
                    title: 'paymentStatus',
                    value: 'paymentStatus',
                    filtering: true,
                    defaultSize: 'sm'
                },
                {
                    title: 'externalTransactionId',
                    value: 'payment.externalId',
                    filtering: true
                },
                {
                    title: 'externalPaymentStatus',
                    filtering: true,
                    valueJsonata: 'payment.externalStatus'
                },
                {
                    title: 'paymentErrorMsg',
                    valueJsonata: "paymentStatus = 'Completed' ? '' : payment.errorMsg"
                },
                {
                    title: 'notes',
                    value: 'id',
                    widget: 'renderTemplate',
                    sorting: false,
                    filtering: false,
                    properties: {
                        colDisplayCondition: '$count(entity.noteItems)>0',
                        colDisplayValue: "$ellipse($join(entity.noteItems.note, ', '), 30)",
                        objectAsTemplateContext: true,
                        templateSelection: 'this',
                        templateId: 'notes',
                        noPrintButton: true
                    }
                },
                {
                    title: 'operatedBy',
                    value: 'operatedBy.label',
                    filtering: true,
                    defaultSize: 'md'
                },
                {
                    title: 'createdBy',
                    value: 'createdBy.label',
                    filtering: true,
                    defaultSize: 'md'
                },
                {
                    title: 'startDate',
                    valueJsonata: '$datetime(startDate)'
                },
                {
                    title: 'createdDate',
                    valueJsonata: '$datetime(createdDate)'
                },
                {
                    title: 'tag',
                    filtering: true,
                    value: 'id.authTag'
                },
                {
                    title: 'createdLocation',
                    value: 'createdLocation',
                    widget: 'map'
                },
                {
                    title: 'variety',
                    value: 'processingProperties.properties.variety.label',
                    filtering: true,
                    optional: true
                },
                {
                    title: 'priceIncreaseString',
                    value: 'processingProperties.properties.priceIncreaseString'
                },
                {
                    title: 'priceAmount',
                    value: 'processingProperties.properties.pricePerWeight.price.amount',
                    filtering: true
                },
                {
                    title: 'pricePerWeight',
                    value: 'processingProperties.properties.pricePerWeight.perWeight.amount',
                    filtering: true
                },
                {
                    title: 'maxQuantityProcessedLimit',
                    value: 'processingProperties.properties.maxQuantityProcessedLimitRaw'
                },
                {
                    title: 'quantityProcessedCurrentSeasonRaw',
                    value: 'processingProperties.properties.quantityProcessedCurrentSeasonRaw'
                },
                {
                    title: 'locationCode',
                    value: 'processingProperties.properties.location.labelShort',
                    filtering: true
                },
                {
                    title: 'locationParentCode',
                    value: 'processingProperties.properties.locationParent.labelShort',
                    filtering: true
                },
                {
                    title: 'facilityCode',
                    value: 'processingProperties.properties.facility.labelShort',
                    filtering: true
                },
                {
                    title: 'createdLocationLat',
                    value: 'createdLocation.latLong.lat'
                },
                {
                    title: 'createdLocationLon',
                    value: 'createdLocation.latLong.lon'
                }
            ],
            entityActivities: {
                updateCollectedCacaoNonEssentials: {
                    name: 'updateCollectedCacaoNonEssentials',
                    label: 'updateCollectedCacao',
                    type: 'UpdateLotSection',
                    rowCondition: "entity.modificationStatus='CanModifyNonEssentials'",
                    method: 'update',
                    options: {
                        refrehAccumulatedProperties: true
                    },
                    variables: [
                        {
                            name: 'id',
                            updateOriginalValueKey: 'id',
                            type: 'hiddenObject',
                            isUpdateSelectionField: true,
                            disable: true,
                            hidden: true,
                            submitReview: {
                                noDisplay: true
                            },
                            fieldType: {
                                name: 'hidden',
                                basetype: 'ANY',
                                inputFieldType: 'hidden',
                                id: 'hiddenObject'
                            }
                        },
                        {
                            name: 'name',
                            updateOriginalValueKey: 'processingProperties.properties.producer.label',
                            type: 'displayObject',
                            properties: {},
                            submitReview: {},
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'beforeWeight',
                            label: 'totalWeight',
                            type: 'weight',
                            disable: true,
                            updateOriginalValueKey: 'processingProperties.properties.beforeWeight',
                            widget: 'weight',
                            properties: {
                                unit: 'kg'
                            },
                            submitReview: {
                                displayWidgetType: 'weight'
                            },
                            fieldType: {
                                name: 'weight',
                                weightVariable: true,
                                inputFieldSubType: 'number',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'object',
                                    fields: {
                                        amount: {
                                            _deps: [],
                                            _conditions: [],
                                            _options: {
                                                abortEarly: true,
                                                recursive: true
                                            },
                                            _exclusive: {
                                                required: false
                                            },
                                            _whitelist: {
                                                list: {},
                                                refs: {}
                                            },
                                            _blacklist: {
                                                list: {},
                                                refs: {}
                                            },
                                            tests: [
                                                null
                                            ],
                                            transforms: [
                                                null
                                            ],
                                            _mutate: false,
                                            _type: 'number'
                                        },
                                        unit: {
                                            _deps: [],
                                            _conditions: [],
                                            _options: {
                                                abortEarly: true,
                                                recursive: true
                                            },
                                            _exclusive: {
                                                required: false
                                            },
                                            _whitelist: {
                                                list: {},
                                                refs: {}
                                            },
                                            _blacklist: {
                                                list: {},
                                                refs: {}
                                            },
                                            tests: [
                                                null,
                                                null
                                            ],
                                            transforms: [
                                                null
                                            ],
                                            _mutate: false,
                                            _type: 'string'
                                        }
                                    },
                                    _nodes: [
                                        'unit',
                                        'amount'
                                    ],
                                    _excludedEdges: []
                                },
                                basetype_post_submit_Raw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        required: false
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number'
                                },
                                transform_post_submit: 'fn(convertWeight)',
                                reverse_transform_at_update: 'fn(reverseConvertWeightFromKg)',
                                id: 'weight',
                                inputFieldType: 'weight'
                            }
                        },
                        {
                            name: 'afterWeight',
                            type: 'system',
                            copyToParent: true,
                            system_givenValue: 'jmespath=beforeWeight',
                            fieldType: {
                                inputFieldType: 'system',
                                name: 'system',
                                id: 'system'
                            }
                        },
                        {
                            name: 'money',
                            label: 'toPay',
                            type: 'displayObject',
                            properties: {
                                label: "[to_string(amount),to_string(unit)] | join(' ', @)"
                            },
                            updateOriginalValueKey: 'processingProperties.properties.money',
                            submitReview: {
                                displayWidgetType: 'money'
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'brix',
                            type: 'number',
                            dependsOnForVisibility: 'producer',
                            validation: {
                                yupRaw: {
                                    _deps: [
                                        'productFull'
                                    ],
                                    _conditions: [
                                        {
                                            refs: [
                                                {
                                                    key: 'productFull',
                                                    prefix: '$',
                                                    isContext: false,
                                                    isSelf: false,
                                                    path: 'productFull'
                                                }
                                            ]
                                        }
                                    ],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        min: true,
                                        max: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number'
                                }
                            },
                            copyToParent: true,
                            updateOriginalValueKey: 'processingProperties.properties.brix',
                            fieldType: {
                                name: 'number',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                inputFieldSubType: 'number',
                                id: 'number'
                            }
                        },
                        {
                            name: 'moistureContent',
                            type: 'percentage',
                            validation: {
                                yupRaw: {
                                    _deps: [
                                        'variety'
                                    ],
                                    _conditions: [
                                        {
                                            refs: [
                                                {
                                                    key: 'variety',
                                                    prefix: '$',
                                                    isContext: false,
                                                    isSelf: false,
                                                    path: 'variety'
                                                }
                                            ]
                                        }
                                    ],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        min: true,
                                        max: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number'
                                }
                            },
                            dependsOnForVisibility: 'producer',
                            copyToParent: true,
                            fieldType: {
                                name: 'percentage',
                                properties: {
                                    suffix: '%'
                                },
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        min: true,
                                        max: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number'
                                },
                                inputFieldType: 'text',
                                inputFieldSubType: 'number',
                                id: 'percentage'
                            }
                        },
                        {
                            name: 'receiptNumber',
                            type: 'text',
                            validation: {
                                yupRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        required: false,
                                        min: true,
                                        max: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null,
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string'
                                }
                            },
                            updateOriginalValueKey: 'processingProperties.properties.receiptNumber',
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        },
                        {
                            name: 'collectionId',
                            type: 'text',
                            hint: 'collectionIdHint',
                            multiple: false,
                            validation: {
                                yupRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        required: false,
                                        undefined: false
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string'
                                }
                            },
                            updateOriginalValueKey: 'processingProperties.properties.collectionId',
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        }
                    ],
                    id: 'updateCollectedCacaoNonEssentials'
                },
                deleteThisHarvest: {
                    rowConditionsForRoles: [
                        {
                            rowCondition: "$includes(['NotSet'], entity.purchaseStatus) and entity.systemState='Open'",
                            roles: [
                                'BuyingOfficer'
                            ]
                        },
                        {
                            rowCondition: "entity.systemState='Open'",
                            roles: [
                                'admin',
                                'FieldManager',
                                'FinancialOfficer',
                                'FinancialManager'
                            ]
                        }
                    ],
                    name: 'deleteThisHarvest',
                    label: 'deleteThisHarvest',
                    type: 'DeleteLotSection',
                    rowCondition: "entity.modificationStatus='CanModify'",
                    method: 'delete',
                    options: {
                        calculateProducerSeasonalWeight: true,
                        refrehAccumulatedProperties: true
                    },
                    variables: [
                        {
                            name: 'id',
                            isRowId: true,
                            type: 'displayObject',
                            disable: true,
                            hidden: true,
                            submitReview: {
                                noDisplay: true
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'name',
                            type: 'displayObject',
                            defaultValue: '#JSONATA#entity.processingProperties.producer.label',
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'date',
                            type: 'displayObject',
                            defaultValue: '#JSONATA#$date(entity.processingProperties.activityStartDateTime)',
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'beforeWeight',
                            type: 'displayObject',
                            defaultValue: "#JSONATA#$weight(entity.processingProperties.beforeWeight, 'kg', false)",
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        }
                    ],
                    id: 'deleteThisHarvest'
                },
                updateCollectedCacao: {
                    rowConditionsForRoles: [
                        {
                            rowCondition: "$includes(['NotSet'], entity.purchaseStatus) and entity.systemState='Open'",
                            roles: [
                                'BuyingOfficer'
                            ]
                        },
                        {
                            rowCondition: "entity.systemState='Open'",
                            roles: [
                                'admin',
                                'FieldManager',
                                'FinancialOfficer',
                                'FinancialManager'
                            ]
                        }
                    ],
                    name: 'updateCollectedCacao',
                    type: 'UpdateLotSection',
                    method: 'update',
                    rowCondition: "entity.modificationStatus='CanModify'",
                    options: {
                        refrehAccumulatedProperties: true,
                        calculateProducerSeasonalWeight: true,
                        dontCopyPropertiesToParent: true,
                        refrehAccumulatedPropertiesByKey: [
                            {
                                key: 'afterWeight'
                            },
                            {
                                key: 'sackCountAfter'
                            }
                        ]
                    },
                    variables: [
                        {
                            name: 'id',
                            updateOriginalValueKey: 'id',
                            type: 'hiddenObject',
                            isUpdateSelectionField: true,
                            disable: true,
                            hidden: true,
                            submitReview: {
                                noDisplay: true
                            },
                            fieldType: {
                                name: 'hidden',
                                basetype: 'ANY',
                                inputFieldType: 'hidden',
                                id: 'hiddenObject'
                            }
                        },
                        {
                            name: 'name',
                            updateOriginalValueKey: 'processingProperties.properties.producer.label',
                            type: 'displayObject',
                            properties: {},
                            submitReview: {},
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'containerWeights',
                            type: 'weightNoConversion',
                            multiple: true,
                            properties: {
                                defaultUnit: 'kg',
                                disableAdd: true
                            },
                            submitReview: {
                                expression: "containerWeights[*].to_string(amount) | [join(' kg, ', @), ' kg'] | join('', @)"
                            },
                            validation: {
                                yupRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        min: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'array',
                                    _subType: {
                                        _deps: [],
                                        _conditions: [],
                                        _options: {
                                            abortEarly: true,
                                            recursive: true
                                        },
                                        _exclusive: {},
                                        _whitelist: {
                                            list: {},
                                            refs: {}
                                        },
                                        _blacklist: {
                                            list: {},
                                            refs: {}
                                        },
                                        tests: [],
                                        transforms: [
                                            null
                                        ],
                                        _mutate: false,
                                        _type: 'object',
                                        fields: {
                                            amount: {
                                                _deps: [],
                                                _conditions: [],
                                                _options: {
                                                    abortEarly: true,
                                                    recursive: true
                                                },
                                                _exclusive: {
                                                    required: false,
                                                    min: true,
                                                    max: true
                                                },
                                                _whitelist: {
                                                    list: {},
                                                    refs: {}
                                                },
                                                _blacklist: {
                                                    list: {},
                                                    refs: {}
                                                },
                                                tests: [
                                                    null,
                                                    null,
                                                    null
                                                ],
                                                transforms: [
                                                    null
                                                ],
                                                _mutate: false,
                                                _type: 'number'
                                            },
                                            unit: {
                                                _deps: [],
                                                _conditions: [],
                                                _options: {
                                                    abortEarly: true,
                                                    recursive: true
                                                },
                                                _exclusive: {
                                                    required: false
                                                },
                                                _whitelist: {
                                                    list: {},
                                                    refs: {}
                                                },
                                                _blacklist: {
                                                    list: {},
                                                    refs: {}
                                                },
                                                tests: [
                                                    null,
                                                    null
                                                ],
                                                transforms: [
                                                    null
                                                ],
                                                _mutate: false,
                                                _type: 'string'
                                            }
                                        },
                                        _nodes: [
                                            'unit',
                                            'amount'
                                        ],
                                        _excludedEdges: []
                                    }
                                }
                            },
                            onChange: [
                                {
                                    fn: "fn(calculateWeightsTotalWithAutomaticTare('containerWeights', 'beforeWeight', kg))"
                                }
                            ],
                            fieldType: {
                                name: 'weight',
                                weightVariable: true,
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'object',
                                    fields: {
                                        amount: {
                                            _deps: [],
                                            _conditions: [],
                                            _options: {
                                                abortEarly: true,
                                                recursive: true
                                            },
                                            _exclusive: {
                                                required: false
                                            },
                                            _whitelist: {
                                                list: {},
                                                refs: {}
                                            },
                                            _blacklist: {
                                                list: {},
                                                refs: {}
                                            },
                                            tests: [
                                                null
                                            ],
                                            transforms: [
                                                null
                                            ],
                                            _mutate: false,
                                            _type: 'number'
                                        },
                                        unit: {
                                            _deps: [],
                                            _conditions: [],
                                            _options: {
                                                abortEarly: true,
                                                recursive: true
                                            },
                                            _exclusive: {
                                                required: false
                                            },
                                            _whitelist: {
                                                list: {},
                                                refs: {}
                                            },
                                            _blacklist: {
                                                list: {},
                                                refs: {}
                                            },
                                            tests: [
                                                null,
                                                null
                                            ],
                                            transforms: [
                                                null
                                            ],
                                            _mutate: false,
                                            _type: 'string'
                                        }
                                    },
                                    _nodes: [
                                        'unit',
                                        'amount'
                                    ],
                                    _excludedEdges: []
                                },
                                id: 'weightNoConversion',
                                inputFieldType: 'weightNoConversion'
                            }
                        },
                        {
                            name: 'weightOfContainerString',
                            type: 'displayObject',
                            disable: true,
                            ignoreValue: true,
                            options: {},
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'beforeWeight',
                            label: 'totalWeight',
                            copyToParent: true,
                            disable: true,
                            type: 'displayObject',
                            properties: {
                                defaultUnit: 'kg',
                                label: "[to_string(amount),to_string(unit)] | join(' ', @)"
                            },
                            onChange: "fn(calculatePriceForVarietyFromOriginProperties('beforeWeight', 'money'))",
                            transform_post_submit: 'fn(convertWeight)',
                            submitReview: {
                                displayWidgetType: 'weight',
                                expression: "[to_string(beforeWeight.amount),to_string(beforeWeight.unit)] | join(' ', @)"
                            },
                            addToOriginProperties: true,
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'afterWeight',
                            type: 'system',
                            copyToParent: true,
                            system_givenValue: 'jmespath=beforeWeight',
                            addToOriginProperties: true,
                            fieldType: {
                                inputFieldType: 'system',
                                name: 'system',
                                id: 'system'
                            }
                        },
                        {
                            name: 'sackCountBefore',
                            label: 'sackCount',
                            type: 'displayObject',
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'sackCountAfter',
                            type: 'system',
                            copyToParent: true,
                            system_givenValue: 'jmespath=sackCountBefore',
                            addToOriginProperties: true,
                            fieldType: {
                                inputFieldType: 'system',
                                name: 'system',
                                id: 'system'
                            }
                        },
                        {
                            name: 'pricePerUnitString',
                            type: 'displayObject',
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'pricePerWeight',
                            type: 'hiddenObject',
                            validation: {
                                required: true
                            },
                            submitReview: {
                                noDisplay: true
                            },
                            fieldType: {
                                name: 'hidden',
                                basetype: 'ANY',
                                inputFieldType: 'hidden',
                                id: 'hiddenObject'
                            }
                        },
                        {
                            name: 'increasePayDetailsStr',
                            type: 'displayObject',
                            validation: {
                                required: false
                            },
                            dependsOnForVisibility: 'paymentType',
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'priceIncreaseString',
                            type: 'displayObject',
                            validation: {
                                required: false
                            },
                            dependsOnForVisibility: 'paymentType',
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'priceIncreaseString',
                            type: 'displayObject',
                            validation: {
                                required: false
                            },
                            dependsOnForVisibility: 'paymentType',
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'money',
                            label: 'toPay',
                            type: 'displayObject',
                            properties: {
                                label: "[to_string(amount),to_string(unit)] | join(' ', @)"
                            },
                            onChange: {
                                jsonata: '$count(containerWeights)',
                                targetProperty: 'sackCountBefore'
                            },
                            submitReview: {
                                expression: "[to_string(money.amount),to_string(money.unit)] | join(' ', @)",
                                displayWidgetType: 'money'
                            },
                            disable: true,
                            addToOriginProperties: true,
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'afterWeight',
                            type: 'system',
                            addToOriginProperties: true,
                            copyToParent: true,
                            system_givenValue: 'jmespath=beforeWeight',
                            fieldType: {
                                inputFieldType: 'system',
                                name: 'system',
                                id: 'system'
                            }
                        },
                        {
                            name: 'brix',
                            type: 'number',
                            dependsOnForVisibility: 'producer',
                            validation: {
                                yupRaw: {
                                    _deps: [
                                        'productFull'
                                    ],
                                    _conditions: [
                                        {
                                            refs: [
                                                {
                                                    key: 'productFull',
                                                    prefix: '$',
                                                    isContext: false,
                                                    isSelf: false,
                                                    path: 'productFull'
                                                }
                                            ]
                                        }
                                    ],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        min: true,
                                        max: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number'
                                }
                            },
                            copyToParent: true,
                            updateOriginalValueKey: 'processingProperties.properties.brix',
                            fieldType: {
                                name: 'number',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                inputFieldSubType: 'number',
                                id: 'number'
                            }
                        },
                        {
                            name: 'moistureContent',
                            type: 'percentage',
                            validation: {
                                yupRaw: {
                                    _deps: [
                                        'variety'
                                    ],
                                    _conditions: [
                                        {
                                            refs: [
                                                {
                                                    key: 'variety',
                                                    prefix: '$',
                                                    isContext: false,
                                                    isSelf: false,
                                                    path: 'variety'
                                                }
                                            ]
                                        }
                                    ],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        min: true,
                                        max: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number'
                                }
                            },
                            dependsOnForVisibility: 'producer',
                            copyToParent: true,
                            fieldType: {
                                name: 'percentage',
                                properties: {
                                    suffix: '%'
                                },
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        min: true,
                                        max: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'number'
                                },
                                inputFieldType: 'text',
                                inputFieldSubType: 'number',
                                id: 'percentage'
                            }
                        },
                        {
                            name: 'receiptNumber',
                            type: 'text',
                            validation: {
                                yupRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        required: false,
                                        min: true,
                                        max: true
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null,
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string'
                                }
                            },
                            updateOriginalValueKey: 'processingProperties.properties.receiptNumber',
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        },
                        {
                            name: 'collectionId',
                            type: 'text',
                            hint: 'collectionIdHint',
                            multiple: false,
                            validation: {
                                yupRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {
                                        required: false,
                                        undefined: false
                                    },
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [
                                        null,
                                        null,
                                        null
                                    ],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string'
                                }
                            },
                            updateOriginalValueKey: 'processingProperties.properties.collectionId',
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        },
                        {
                            name: 'noteForAC',
                            label: 'note',
                            type: 'text',
                            copyToParent: true,
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        }
                    ],
                    id: 'updateCollectedCacao'
                },
                addNotePostHarvestCollectionAc: {
                    type: 'ProcessAC',
                    options: {
                        processNote: true
                    },
                    aCType: 'DontCreate',
                    method: 'action',
                    label: 'addNote',
                    variables: [
                        {
                            name: 'id',
                            updateOriginalValueKey: 'id',
                            type: 'hiddenObject',
                            isUpdateSelectionField: true,
                            disable: true,
                            hidden: true,
                            isRowId: true,
                            submitReview: {
                                noDisplay: true
                            },
                            fieldType: {
                                name: 'hidden',
                                basetype: 'ANY',
                                inputFieldType: 'hidden',
                                id: 'hiddenObject'
                            }
                        },
                        {
                            name: 'noteForAC',
                            label: 'note',
                            copyToParent: true,
                            type: 'text',
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        }
                    ],
                    id: 'addNotePostHarvestCollectionAc',
                    name: 'addNotePostHarvestCollectionAc'
                }
            }
        },
        payments: {
            source: 'paymenttransactions',
            name: 'payments',
            ordering: [
                {
                    key: 'createdDate',
                    direction: 'desc'
                }
            ],
            dataFetchOptions: {
                expandChildren: false,
                applyAC: true
            },
            transformations: [],
            filters: [],
            columns: [
                {
                    title: 'code',
                    filtering: true,
                    value: 'producerEntity.labelShort'
                },
                {
                    title: 'name',
                    filtering: true,
                    defaultSize: 'sm',
                    value: 'producerName'
                },
                {
                    title: 'lot',
                    defaultSize: 'md',
                    filtering: true,
                    value: 'productionEntityParent.chainLabel'
                },
                {
                    title: 'type',
                    filtering: true,
                    value: 'type'
                },
                {
                    title: 'externalTransactionId',
                    filtering: true,
                    value: 'externalId'
                },
                {
                    title: 'phone',
                    defaultSize: 'sm',
                    filtering: true,
                    value: 'targetAccountId'
                },
                {
                    title: 'firstName',
                    filtering: true,
                    value: 'targetFirstName',
                    defaultSize: 'md'
                },
                {
                    title: 'lastName',
                    filtering: true,
                    value: 'targetLastName',
                    defaultSize: 'md'
                },
                {
                    title: 'amount',
                    filtering: true,
                    value: 'amount'
                },
                {
                    title: 'currency',
                    value: 'currency'
                },
                {
                    title: 'weight',
                    filtering: true,
                    value: 'productQuantity.amount'
                },
                {
                    title: 'status',
                    filtering: true,
                    defaultSize: 'sm',
                    value: 'status'
                },
                {
                    title: 'errorMsg',
                    value: 'errorMsg',
                    defaultSize: 'md'
                },
                {
                    title: 'resolutionComment',
                    value: 'resolutionComment',
                    defaultSize: 'md'
                },
                {
                    title: 'externalAccount',
                    value: 'externalAccount',
                    filtering: true
                },
                {
                    title: 'externalState',
                    value: 'externalState',
                    filtering: true
                },
                {
                    title: 'feeCharged',
                    value: 'feeCharged'
                },
                {
                    title: 'createdDate',
                    valueJsonata: '$datetime(transactionCreatedDate)',
                    filtering: false
                },
                {
                    title: 'createdBy',
                    value: 'transactionCreatedBy.label',
                    defaultSize: 'md'
                },
                {
                    title: 'updatedBy',
                    value: 'updatedBy.label',
                    defaultSize: 'md'
                },
                {
                    title: 'updatedDate',
                    valueJsonata: '$datetime(updatedDate)',
                    filtering: false
                },
                {
                    title: 'operatedBy',
                    value: 'operatedBy.label',
                    defaultSize: 'md'
                },
                {
                    title: 'createdLocation',
                    value: 'createdLocation',
                    widget: 'map'
                },
                {
                    title: 'properties',
                    value: 'id',
                    widget: 'renderReactTemplate',
                    properties: {
                        largePopup: true,
                        objectAsTemplateContext: true,
                        noPrintButton: true,
                        templateSelection: 'this',
                        templateId: 'jsonViewer'
                    },
                    sorting: false,
                    filtering: false
                },
                {
                    title: 'activityLogs',
                    value: 'id',
                    widget: 'renderReactTemplate',
                    properties: {
                        largePopup: true,
                        objectAsTemplateContext: true,
                        noPrintButton: true,
                        templateSelection: 'this',
                        templateId: 'entityActivityLogs2'
                    }
                }
            ],
            sourceActivities: {},
            entityActivities: {
                QueryPaymenStatus: {
                    label: 'QueryPaymenStatusFromMfs',
                    type: 'QueryPaymenStatus',
                    method: 'action',
                    options: {},
                    variables: [
                        {
                            name: 'id',
                            type: 'displayObject',
                            properties: {
                                label: 'id.label'
                            },
                            isRowId: true,
                            submitReview: {
                                expression: 'id.label'
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        }
                    ],
                    id: 'QueryPaymenStatus',
                    name: 'QueryPaymenStatus'
                },
                UpdatePaymentStatusManually: {
                    label: 'UpdatePaymentStatus',
                    type: 'UpdatePaymentTransaction',
                    method: 'action',
                    options: {},
                    variables: [
                        {
                            name: 'id',
                            label: 'payment',
                            type: 'displayObject',
                            properties: {
                                label: 'id.label'
                            },
                            isRowId: true,
                            submitReview: {
                                expression: 'id.label'
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        },
                        {
                            name: 'status',
                            type: 'selectSimple',
                            options: {
                                method: 'list',
                                listReference: 'paymentStatuses'
                            },
                            fieldType: {
                                inputFieldType: 'select',
                                name: 'selectSimple',
                                basetype: 'ANY',
                                id: 'selectSimple'
                            }
                        },
                        {
                            name: 'resolutionComment',
                            label: 'comment',
                            type: 'text',
                            validation: {
                                required: false
                            },
                            fieldType: {
                                name: 'text',
                                basetypeRaw: {
                                    _deps: [],
                                    _conditions: [],
                                    _options: {
                                        abortEarly: true,
                                        recursive: true
                                    },
                                    _exclusive: {},
                                    _whitelist: {
                                        list: {},
                                        refs: {}
                                    },
                                    _blacklist: {
                                        list: {},
                                        refs: {}
                                    },
                                    tests: [],
                                    transforms: [
                                        null
                                    ],
                                    _mutate: false,
                                    _type: 'string',
                                    _nullable: true
                                },
                                inputFieldType: 'text',
                                id: 'text'
                            }
                        }
                    ],
                    id: 'UpdatePaymentStatusManually',
                    name: 'UpdatePaymentStatusManually'
                },
                RetriggerPayment: {
                    label: 'RetriggerPayment',
                    type: 'RetriggerPayment',
                    method: 'action',
                    options: {},
                    variables: [
                        {
                            name: 'id',
                            type: 'displayObject',
                            properties: {
                                label: 'id.label'
                            },
                            isRowId: true,
                            submitReview: {
                                expression: 'id.label'
                            },
                            fieldType: {
                                name: 'displayObject',
                                basetype: 'ANY',
                                inputFieldType: 'displayObject',
                                id: 'displayObject'
                            }
                        }
                    ],
                    id: 'RetriggerPayment',
                    name: 'RetriggerPayment'
                }
            }
        }
    }
};
