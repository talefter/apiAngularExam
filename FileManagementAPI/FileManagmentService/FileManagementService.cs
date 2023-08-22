using Microsoft.AspNetCore.Http;

namespace FileManagmentService
{
    public class FileManagementService :IFileManagementService
    {
        private readonly string _filesDirectory = "FileStorage";

        public FileStream DownloadFile(string filename)
        {
            var filePath = Path.Combine(_filesDirectory, filename);
            if (!File.Exists(filePath))
                throw new Exception("file not found");

            return new FileStream(filePath, FileMode.Open, FileAccess.Read);
            
        }

        public string[] ListFiles()
        {
            return Directory.GetFiles(_filesDirectory);
      
        }


        public void Upload(IFormFile file)
        {

            if (file == null || file.Length == 0)
            {
                 throw new Exception("Invalid file");
            }

            string filePath = Path.Combine(_filesDirectory, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

        }

        public void Delete(string fileName)
        {
            string filePath = Path.Combine(_filesDirectory, fileName);
            if (!File.Exists(filePath))
            {
                throw new Exception("file not found");
            }

            File.Delete(filePath);
        }

        public void Edit(string fileName, string newFileName)
        {
            string filePath = Path.Combine(_filesDirectory, fileName);
            string newFilePath = Path.Combine(_filesDirectory, newFileName);

            if (!File.Exists(filePath))
            {
                throw new Exception("file not found");
            }

            File.Move(filePath, newFilePath);
        }

        public void Duplicate(string fileName)
        {
            string filePath = Path.Combine(_filesDirectory, fileName);
            if (!File.Exists(filePath))
            {
                throw new Exception("file not found");
            }

            string newFileName = "Copy_" + fileName;
            string newFilePath = Path.Combine(_filesDirectory, newFileName);

            File.Copy(filePath, newFilePath);
        }

    }
}