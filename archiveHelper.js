const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const modifyArchive = () => {
  const inputArchivePath = "./output/archive.zip";
  const outputArchivePath = "./output/archive-copy.zip";
  const tempFolderPath = "./output/archive";

  // Создаем временную папку
  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath);
  }

  try {
    // Распаковываем архив
    const zip = new AdmZip(inputArchivePath);
    zip.extractAllTo(tempFolderPath, true);

    // Удаляем папку /PDF/
    fs.readdirSync(tempFolderPath).forEach((folder) => {
      const pdfFolderPath = path.join(tempFolderPath, folder, "PDF");
      if (fs.existsSync(pdfFolderPath)) {
        fs.rmdirSync(pdfFolderPath, { recursive: true });
      }
    });

    // Перемещаем файлы из папки /SVG/ в предыдущую папку и переименовываем файлы
    fs.readdirSync(tempFolderPath).forEach((folder) => {
      const svgFolderPath = path.join(tempFolderPath, folder, "SVG");
      if (fs.existsSync(svgFolderPath)) {
        const files = fs.readdirSync(svgFolderPath);
        files.forEach((file) => {
          const oldFilePath = path.join(svgFolderPath, file);
          const newFilePath = path.join(
            tempFolderPath,
            folder,
            file.replace("fluent_", "")
          );
          fs.renameSync(oldFilePath, newFilePath);
        });
        fs.readdirSync(svgFolderPath).forEach((svgFile) => {
          const svgFilePath = path.join(svgFolderPath, svgFile);
          const newSvgFilePath = path.join(tempFolderPath, folder, svgFile);
          fs.renameSync(svgFilePath, newSvgFilePath);
        });
      }
    });

    // Удаляем папку /SVG/
    fs.readdirSync(tempFolderPath).forEach((folder) => {
      const svgFolderPath = path.join(tempFolderPath, folder, "SVG");
      if (fs.existsSync(svgFolderPath)) {
        fs.rmdirSync(svgFolderPath, { recursive: true });
      }
    });

    // Архивируем обратно
    const outputZip = new AdmZip();
    outputZip.addLocalFolder(tempFolderPath);
    outputZip.writeZip(outputArchivePath);

    console.log("Все операции выполнены успешно");
  } catch (err) {
    console.error(`Ошибка при обработке архива: ${err}`);
  } finally {
    // Удаляем временную папку
    if (fs.existsSync(tempFolderPath)) {
      fs.rmdirSync(tempFolderPath, { recursive: true });
    }
  }
};

module.exports = { modifyArchive };
