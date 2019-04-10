// AESEncrypt.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include "pch.h"
#include <iostream>

#include <iostream>
#include <iomanip>

#pragma comment(lib, "cryptlib.lib")

#include "dll.h"

#include "modes.h"
#include "aes.h"
#include "filters.h"

int main(int argc, char* argv[]) {

	//Key and IV setup
	//AES encryption uses a secret key of a variable length (128-bit, 196-bit or 256-   
	//bit). This key is secretly exchanged between two parties before communication   
	//begins. DEFAULT_KEYLENGTH= 16 bytes
	CryptoPP::byte key[CryptoPP::AES::DEFAULT_KEYLENGTH], iv[CryptoPP::AES::BLOCKSIZE];
	memset(key, 0x00, CryptoPP::AES::DEFAULT_KEYLENGTH);
	memset(iv, 0x00, CryptoPP::AES::BLOCKSIZE);

	//
	// String and Sink setup
	//
	std::string plaintext = "Now is the time for all good men to come to the aide...";
	std::string ciphertext;
	std::string decryptedtext;

	//
	// Dump Plain Text
	//
	std::cout << "Plain Text (" << plaintext.size() << " bytes)" << std::endl;
	std::cout << plaintext;
	std::cout << std::endl << std::endl;

	//
	// Create Cipher Text
	//
	CryptoPP::AES::Encryption aesEncryption(key, CryptoPP::AES::DEFAULT_KEYLENGTH);
	CryptoPP::CBC_Mode_ExternalCipher::Encryption cbcEncryption(aesEncryption, iv);

	CryptoPP::StreamTransformationFilter stfEncryptor(cbcEncryption, new CryptoPP::StringSink(ciphertext));
	stfEncryptor.Put(reinterpret_cast<const unsigned char*>(plaintext.c_str()), plaintext.length());
	stfEncryptor.MessageEnd();

	//
	// Dump Cipher Text
	//
	std::cout << "Cipher Text (" << ciphertext.size() << " bytes)" << std::endl;

	for (int i = 0; i < ciphertext.size(); i++) {

		std::cout << "0x" << std::hex << (0xFF & static_cast<CryptoPP::byte>(ciphertext[i])) << " ";
	}

	std::cout << std::endl << std::endl;

	//
	// Decrypt
	//
	CryptoPP::AES::Decryption aesDecryption(key, CryptoPP::AES::DEFAULT_KEYLENGTH);
	CryptoPP::CBC_Mode_ExternalCipher::Decryption cbcDecryption(aesDecryption, iv);

	CryptoPP::StreamTransformationFilter stfDecryptor(cbcDecryption, new CryptoPP::StringSink(decryptedtext));
	stfDecryptor.Put(reinterpret_cast<const unsigned char*>(ciphertext.c_str()), ciphertext.size());
	stfDecryptor.MessageEnd();

	//
	// Dump Decrypted Text
	//
	std::cout << "Decrypted Text: " << std::endl;
	std::cout << decryptedtext;
	std::cout << std::endl << std::endl;

	return 0;
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
