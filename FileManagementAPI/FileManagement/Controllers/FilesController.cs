using FileManagmentService;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace FileManagement.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FilesController : ControllerBase
    {

        private readonly IFileManagementService _fileManagementService;
        public FilesController(IFileManagementService fileManagementService)
        {
            _fileManagementService = fileManagementService;
        }
        [HttpGet("{filename}")]
        public IActionResult DownloadFile(string filename)
        {
            var fileStream = _fileManagementService.DownloadFile(filename);
            return File(fileStream, "application/octet-stream", filename);
        }

        [HttpGet("list")]
        public IActionResult ListFiles()
        {
            var files = _fileManagementService.ListFiles();
            return Ok(files.Select(Path.GetFileName));
        }


        [HttpPost("upload")]
        public IActionResult Upload([FromForm] IFormFile file)
        {

            _fileManagementService.Upload(file);

            //TODO:had some problems with swagger 
            //return CreatedAtAction(nameof(DownloadFile), new { file.FileName}); 
            return Ok("File uploaded successfully");
        }

        [HttpDelete("{fileName}")]
        public IActionResult Delete(string fileName)
        {
            _fileManagementService.Delete(fileName);

            return Ok("File deleted successfully");
        }

        [HttpPut("{fileName}")]
        public IActionResult Edit(string fileName, [FromBody] string newFileName)
        {
            _fileManagementService.Edit(fileName,newFileName);

            return Ok("File name edited successfully");
        }

        [HttpPost("duplicate/{fileName}")]
        public IActionResult Duplicate([FromBody] string fileName)
        {
            _fileManagementService.Duplicate(fileName);

            return Ok("File duplicated successfully");
        }

    }
}


