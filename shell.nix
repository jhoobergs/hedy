let
  unstable = import (fetchTarball https://nixos.org/channels/nixos-unstable/nixexprs.tar.xz) { };
in
{ pkgs ? import <nixpkgs> {} }:
(pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    python39
    python39Packages.pip
    python39Packages.virtualenv
    unstable.vscode.fhs
  ];
})
