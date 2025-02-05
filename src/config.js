import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MASS$2y$12$JVTN0.SWAn7yrpcSeqc8M.HSMOagYZ0lhu9ia5CKCOqiiy7OtxG5WADMIN'; 

export const API_URL = import.meta.env.VITE_APP_API_URL;
export const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

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

export const exportToExcel = (data = [],fileName) => {
    if(fileName === undefined || fileName === null || fileName.length === 0) {
        fileName =  getRandomInt(1, 99999)
    }

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

    saveAs(file, `${fileName}-data.xlsx`);
}

export const encryptData =(data)=> {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

export const decryptData = (data) => {
    const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }

export const configPermission = {
    'VIEW_USER': 'View User',
    'ADD_USER': 'Add User',
    'EDIT_USER': 'Edit User',
    'DELETE_USER': 'Delete User',
    'VIEW_EMPLOYEE': 'View Employee',
    'ADD_EMPLOYEE': 'Add Employee',
    'EDIT_EMPLOYEE': 'Edit Employee',
    'DELETE_EMPLOYEE': 'Delete Employee',
    'VIEW_ROLE': 'View Role',
    'ADD_ROLE': 'Add Role',
    'EDIT_ROLE': 'Edit Role',
    'DELETE_ROLE': 'Delete Role',
    'VIEW_PERMISSION': 'View Permission',
    'ADD_PERMISSION': 'Add Permission',
    'EDIT_PERMISSION': 'Edit Permission',
    'DELETE_PERMISSION': 'Delete Permission',
    'VIEW_PAGE': 'View Page',
    'ADD_PAGE': 'Add Page',
    'EDIT_PAGE': 'Edit Page',
    'DELETE_PAGE': 'Delete Page',
    'VIEW_PRODUCT': 'View Product',
    'ADD_PRODUCT': 'Add Product',
    'EDIT_PRODUCT': 'Edit Product',
    'DELETE_PRODUCT': 'Delete Product',
    'VIEW_PRODUCT_ANALYTIC': 'View Product Analytic',
    'VIEW_REWARD': 'View Reward',
    'ADD_REWARD': 'Add Reward',
    'EDIT_REWARD': 'Edit Reward',
    'DELETE_REWARD': 'Delete Reward',
    'VIEW_OFFER': 'View Offer',
    'ADD_OFFER': 'Add Offer',
    'EDIT_OFFER': 'Edit Offer',
    'DELETE_OFFER': 'Delete Offer',
    'VIEW_QR': 'View QR',
    'ADD_QR': 'Add QR',
    // 'EDIT_QR': 'Edit QR',
    // 'DELETE_QR': 'Delete QR',
    'VIEW_QR_DETAIL': 'View QR Detail',
    'VIEW_REDEMPTION': 'View Redemption',
    // 'ADD_REDEMPTION': 'Add Redemption',
    // 'EDIT_REDEMPTION': 'Edit Redemption',
    // 'DELETE_REDEMPTION': 'Delete Redemption',
    'VIEW_REFERRAL': 'View Referral',
    // 'ADD_REFERRAL': 'Add Referral',
    // 'EDIT_REFERRAL': 'Edit Referral',
    // 'DELETE_REFERRAL': 'Delete Referral',
    'VIEW_NOTIFICATION': 'View Notification',
    'ADD_NOTIFICATION': 'Add Notification',
    'EDIT_NOTIFICATION': 'Edit Notification',
    'DELETE_NOTIFICATION': 'Delete Notification', 
    'VIEW_SHORT': 'View Short',
    'ADD_SHORT': 'Add Short',
    'EDIT_SHORT': 'Edit Short',
    'DELETE_SHORT': 'Delete Short', 
    'VIEW_AREA' : 'View Area',
    'ADD_AREA' : 'Add Area',
    'EDIT_AREA' : 'Edit Area',
    'DELETE_AREA' : 'Delete Area',
    'VIEW_ANNOUNCEMENT' : 'View Announcement',
    'ADD_ANNOUNCEMENT' : 'Add Announcement',
    'EDIT_ANNOUNCEMENT' : 'Edit Announcement',
    'DELETE_ANNOUNCEMENT' : 'Delete Announcement',    
    'VIEW_PRODUCT_REVIEW':'View Product Review'
}

export const getValueOrDefault = (value, defaultValue = "N/A") => {
    if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          return value.length > 0 ? value : defaultValue; 
        }
        return Object.keys(value).length > 0 ? value : defaultValue; 
    }
    return value ? value : defaultValue;
}

export const getInitYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let year = 2025; year <= currentYear; year++) {
        if(year){
           years.push(year); 
        }        
    }
    return years;
}
  
export function removeCountryCode(phoneNumber) {
    return phoneNumber.replace(/^\+91\s?/, '');
}
