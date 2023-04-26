const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const modifyArchive = () => {
  const inputFolderPath = "./output";
  const tempFolderPath = "./output/archive";
  let inputZipFileName = "";

  // Получаем имя zip файла
  const files = fs.readdirSync(inputFolderPath);
  files.forEach((file) => {
    if (path.extname(file) === ".zip") {
      inputZipFileName = file;
    }
  });

  if (!inputZipFileName) {
    console.error("Zip-файл не найден");
    return;
  }

  const inputArchivePath = path.join(inputFolderPath, inputZipFileName);
  const outputArchivePath = path.join(
    inputFolderPath,
    `modified_${inputZipFileName}`
  );

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
modifyArchive();
