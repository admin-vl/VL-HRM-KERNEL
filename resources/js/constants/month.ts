import { TFunction } from "i18next";

// export const getMonths = (t: TFunction<'translation'>) => [
//     { value: 1, label: t('January') },
//     { value: 2, label: t('February') },
//     { value: 3, label: t('March') },
//     { value: 4, label: t('April') },
//     { value: 5, label: t('May') },
//     { value: 6, label: t('June') },
//     { value: 7, label: t('July') },
//     { value: 8, label: t('August') },
//     { value: 9, label: t('September') },
//     { value: 10, label: t('October') },
//     { value: 11, label: t('November') },
//     { value: 12, label: t('December') },
// ];
export const getMonths = (t: TFunction<'translation'>) => [
    { value: '1', label: t('January') },
    { value: '2', label: t('February') },
    { value: '3', label: t('March') },
    { value: '4', label: t('April') },
    { value: '5', label: t('May') },
    { value: '6', label: t('June') },
    { value: '7', label: t('July') },
    { value: '8', label: t('August') },
    { value: '9', label: t('September') },
    { value: '10', label: t('October') },
    { value: '11', label: t('November') },
    { value: '12', label: t('December') },
];

export const totalMonths = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
};


export const getYearMonth = (year, month) => {
    return totalMonths[month] + " " + year
}