import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getRecords from '@salesforce/apex/DataController.getRecords';
import updateRecords from '@salesforce/apex/DataController.updateRecords';

export default class First extends LightningElement {
    // Define columns for Salesforce LWC lightning-datatable with inline editing
    columns = [
        { label: 'Name', fieldName: 'name', type: 'text', editable: true },
        { label: 'Email', fieldName: 'email', type: 'email', editable: true },
        { label: 'Phone', fieldName: 'phone', type: 'phone' },
        { label: 'Amount', fieldName: 'amount', type: 'currency', editable: true },
        { label: 'Date', fieldName: 'date', type: 'date', editable: true },
        { label: 'Status', fieldName: 'status', type: 'text' }
    ];

    // Reactive property for dynamic parameter
    searchKey = '';

    // Draft values for inline editing
    draftValues = [];

    // Store the wired result for refresh
    wiredResult;

    // Wire method to call Apex class and get data with dynamic parameter
    @wire(getRecords, { searchKey: '$searchKey' })
    wiredRecords(result) {
        this.wiredResult = result;
        if (result.data) {
            this.data = result.data; // Assign data to datatable data variable
        } else if (result.error) {
            console.error('Error fetching records:', result.error);
            // Handle error appropriately, e.g., show toast
        }
    }

    // Method to handle input change and update searchKey dynamically
    handleInputChange(event) {
        this.searchKey = event.target.value;
    }

    // Method to handle inline save for editable data table
    async handleSave(event) {
        const updatedFields = event.detail.draftValues;

        // Call Apex to update records
        try {
            await updateRecords({ records: updatedFields });
            // Clear draft values
            this.draftValues = [];
            // Refresh the data
            await refreshApex(this.wiredResult);
        } catch (error) {
            console.error('Error updating records:', error);
            // Handle error, e.g., show toast
        }
    }
}