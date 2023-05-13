let
  unstable = import (fetchTarball https://nixos.org/channels/nixos-unstable/nixexprs.tar.xz) { };
in
{ pkgs ? import <nixpkgs> {} }:
(pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    python39
    python39Packages.pip
    python39Packages.virtualenv
    (unstable.vscode-with-extensions.override {
    vscodeExtensions = with unstable.vscode-extensions; [
    ] ++ pkgs.vscode-utils.extensionsFromVscodeMarketplace [
	{
        name = "remote-containers";
        publisher = "ms-vscode-remote";
        version = "0.293.0";
        sha256 = "U7gilVJx8c+nmh6YVGVLoRKjC2n71Vih6aALWkcQw0I=";
      }	
    ];
  })
  ];
})
