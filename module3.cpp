include <iostream>
#include <sstream>
#include <stdexcept>
#include <fstream>
#include <string>

#include <ipfs/client.h>
#include <ipfs/test/utils.h>

ipfs::json module3(string fileName) {
  try {
    ipfs::Client client("localhost", 5001);

	std::ifstream ifs(fileName);
	std::string content( (std::istreambuf_iterator<char>(ifs) ),
                       (std::istreambuf_iterator<char>()    ) );
	
    ipfs::Json add_result;
	
    client.FilesAdd(
        {{fileName, ipfs::http::FileUpload::Type::kFileContents, content}},
        &add_result);
    std::cout << "FilesAdd() result:" << std::endl
              << add_result.dump(2) << std::endl;

  } catch (const std::exception& e) {
    std::cerr << e.what() << std::endl;
    return "Error adding file.";
  }

  return add_result.dump(2);
}