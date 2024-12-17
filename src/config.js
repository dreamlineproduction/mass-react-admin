import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const API_URL = import.meta.env.VITE_APP_API_URL;

export const createSlug = (text = '') => {
    if (text) {
        return text.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    }
    return
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);   // Round up the minimum value
    max = Math.floor(max);  // Round down the maximum value
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const exportToExcel = (data = []) => {
    if (data === undefined || data === null || data.length === 0) {
        throw new Error('The variable is undefined or null.');
    }


    // Create a worksheet from the data array
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Convert the workbook to a binary Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob and save the file
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const fileName = getRandomInt(1, 99999);
    saveAs(file, `${fileName}-data.xlsx`);
}
