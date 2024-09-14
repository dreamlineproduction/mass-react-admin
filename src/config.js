export const API_URL = import.meta.env.REACT_APP_API_URL;

export const createSlug = (text = '') => {
    if(text) {
        return text.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    }    
    return
}

export const statusBadge = (status) => {
    if(status === 1){
        return (<span className="badge bg-success">Active</span>)
    } else {
        return (<span className="badge bg-danger">Block</span>)
    }
}


