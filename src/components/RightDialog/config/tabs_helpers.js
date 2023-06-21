import React from 'react'


export const tabs_helper_capabilities = ( dataForTabs) => {
    let capabilities = [
        {
            title: 'מידע טכני',
            subTitle: [
                { key: 'brand', value: dataForTabs?.brand },
                { key: 'model', value: dataForTabs?.model },
            ],
        },
        {
            title: ' יכולות',
            subTitle: [
                { key: 'seats', value: dataForTabs?.seats },
                { key: 'seats_standing', value: dataForTabs?.seats_standing },
                { key: 'car_type_name', value: dataForTabs?.car_type_name },
            ],
        },
    ];
  return capabilities
}
//constraints
export const tabs_helper_constraints = ( dataForTabs ) => {
    let capabilities = [
        {
            title: 'נהג ',
            subTitle: [
                { key: 'driver_language', value: dataForTabs?.driver_language },
            ],
        },
        {
            title: 'רכב',
            subTitle: [
                { key: 'Seat_belt', value: dataForTabs?.Seat_belt },
                { key: 'Wifi', value: dataForTabs?.Wifi },
            ],
        },
    ];
  return capabilities
}
export const tabs_helper_driver_capability=(data)=>{
    let listItems = [
    { key: "license_number", value: data?.license_number , needTranslate:false },
    { key:"license_expiration", value: data?.license_expiration , needTranslate:false},
    { key:"license_type", value: data?.license_type , needTranslate:false},
    { key:"languages", value: data?.languages , needTranslate:false ,isLanguage:true},
    { key:"religion", value: data?.religion , needTranslate:true},
    { key:"gender", value: data?.gender , needTranslate:true},

    ]

    return listItems
}
export const tabs_helper_chaperone_capability=(data)=>{
    let listItems = [
    { key:"language", value: data?.language , needTranslate:false,isLanguage:true },
    { key:"religion", value: data?.religion , needTranslate:true},
    { key:"gender", value: data?.gender , needTranslate:true },

    ]

    return listItems
}
export const tabs_helper_driver_availability=(data)=>{
    let listItems = [
    { key: "contract_type", value: data?.contract_type },
    { key:"rest_day", value: data?.rest_day },

    ]

    return listItems
}

export const tabs_helper_expenses = (dataForTabs) => {
    let expenses = [
        {
            title: 'אחזקה',
            subTitle: [
                { key: 'brand', value: dataForTabs.brand },
                { key: 'model', value: dataForTabs.model },
            ],
        },
        {
            title: 'הוצאות',
            subTitle: [
                { key: 'seats', value: dataForTabs.seats },
                { key: 'seats_standing', value: dataForTabs.seats_standing },
                { key: 'car_type_name', value: dataForTabs.car_type_name },
            ],
        },
    ];
    return expenses

  }
  export const tabs_helpers_equipment = (extraDataForTabs) => {
    let equipment = [
        {
            title: ` ${extraDataForTabs.expenses} שם הפריט`,
            //'expenses'
            subTitle: [
                { key: 'expenses_count', value: extraDataForTabs.expenses_count },
                { key: 'expenses_date', value: extraDataForTabs.expenses_date },
                {
                    key: 'expenses_driver_name',
                    value: extraDataForTabs.expenses_driver_name,
                },
                { key: 'expenses_date_2', value: extraDataForTabs.expenses_date_2 },
                {
                    key: 'expenses_reciver_name',
                    value: extraDataForTabs.expenses_reciver_name,
                },
            ],
        },
    ];
    return equipment

  }
  export const tabs_helpers_document = (extraDataForTabs) => {
    let documents = [
        {
            title: ` ${extraDataForTabs.document_name} שם המסמך`,
            subTitle: [
                { key: 'document_type', value: extraDataForTabs.expenses_count },
                { key: 'document_date', value: extraDataForTabs.document_date },
            ],
        },
    ];
    return documents
  }
