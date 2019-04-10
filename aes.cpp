// AESEncrypt.cpp : This file contains the 'main' function. Program execution begins and ends there.

#include "pch.h"

#include <iostream>
#include <iomanip>

#include <fstream>
#include <string>

#include "modes.h"
#include "aes.h"
#include "filters.h"

int main(int argc, char* argv[]) {


	//Key String used for encryption
	std::stringstream str;
	std::string s1 = "encryptkey";
	str << s1;
	int value;
	str >> std::hex >> value;

	//declare keys
	CryptoPP::byte key[CryptoPP::AES::DEFAULT_KEYLENGTH], iv[CryptoPP::AES::BLOCKSIZE];
	memset(key, value, CryptoPP::AES::DEFAULT_KEYLENGTH);
	memset(iv, 0x00, CryptoPP::AES::BLOCKSIZE);

	//set up plaintext string, and cipher and decrypted texts
	std::string plaintext = "Example Text. This string will be a .json file.";
	std::string ciphertext;
	std::string decryptedtext;

	// Dump Key
	std::cout << "Key - " << s1 << std::endl;
	std::cout << std::endl;

	// Dump Plain Text
	std::cout << "Plain Text (" << plaintext.size() << " bytes)" << std::endl;
	std::cout << plaintext;
	std::cout << std::endl << std::endl;

	// Create Cipher Text
	CryptoPP::AES::Encryption aesEncryption(key, CryptoPP::AES::DEFAULT_KEYLENGTH);
	CryptoPP::CBC_Mode_ExternalCipher::Encryption cbcEncryption(aesEncryption, iv);

	CryptoPP::StreamTransformationFilter stfEncryptor(cbcEncryption, new CryptoPP::StringSink(ciphertext));
	stfEncryptor.Put(reinterpret_cast<const unsigned char*>(plaintext.c_str()), plaintext.length());
	stfEncryptor.MessageEnd();

	// Dump Cipher Text
	std::cout << "Cipher Text (" << ciphertext.size() << " bytes)" << std::endl;

	for (int i = 0; i < ciphertext.size(); i++) {
		std::cout << "0x" << std::hex << (0xFF & static_cast<CryptoPP::byte>(ciphertext[i])) << " ";
	}

	std::cout << std::endl << std::endl;

	//write cipher text to file
	std::ofstream encryptFile;
	encryptFile.open("encryptedJSON.txt", std::ofstream::binary);
	encryptFile << ciphertext;
	encryptFile.close();

	// Decrypt cipher text to new file
	// read cipher text from encryptedJSON.txt to buffer
	std::ifstream readEncrypt;
	readEncrypt.open("encryptedJSON.txt", std::ofstream::binary);
	std::stringstream buffer;
	buffer << readEncrypt.rdbuf();
	std::string cipherstr = buffer.str();

	// Decrypt
	CryptoPP::AES::Decryption aesDecryption(key, CryptoPP::AES::DEFAULT_KEYLENGTH);
	CryptoPP::CBC_Mode_ExternalCipher::Decryption cbcDecryption(aesDecryption, iv);

	CryptoPP::StreamTransformationFilter stfDecryptor(cbcDecryption, new CryptoPP::StringSink(decryptedtext));
//	stfDecryptor.Put(reinterpret_cast<const unsigned char*>(ciphertext.c_str()), ciphertext.size());
	stfDecryptor.Put(reinterpret_cast<const unsigned char*>(cipherstr.c_str()), cipherstr.size());
	stfDecryptor.MessageEnd();

	//write to decryptedJSON.txt
	std::ofstream decryptFile;
	decryptFile.open("decryptedJSON.txt");
	decryptFile << decryptedtext;
	decryptFile.close();

	// Dump Decrypted Text
	std::cout << "Decrypted Text: " << std::endl;
	std::cout << decryptedtext;
	std::cout << std::endl << std::endl;

//	system("pause");

	return 0;
}

