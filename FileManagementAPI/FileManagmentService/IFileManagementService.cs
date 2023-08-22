using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileManagmentService
{
    public interface IFileManagementService
    {
        FileStream DownloadFile(string filename);
        string[] ListFiles();
        void Upload(IFormFile file);
        void Delete(string fileName);
        void Edit(string fileName, string newFileName);
        void Duplicate(string fileName);
    }
}
