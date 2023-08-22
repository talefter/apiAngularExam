import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private apiUrl = 'http://localhost:5240/Files/'; // Replace with your API endpoint

    constructor(private http: HttpClient) {}

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}upload`, formData);
    }

    deleteFile(filename: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}${filename}`);
    }
    getAllFiles(): Observable<any> {
        return this.http.get(`${this.apiUrl}list`);
    }

    downloadFile(filename: string): Observable<any> {
        return this.http.get(`${this.apiUrl}${filename}/download`);
    }
    renameFile(oldFilename: string, newFilename: string): Observable<any> {
        return this.http.put(`${this.apiUrl}${oldFilename}`, {newFilename});
    }

    duplicateFile(filename: string): Observable<any> {
        return this.http.post(`${this.apiUrl}duplicate`, filename);
    }
}
