let
  mach-nix = import (builtins.fetchGit {
    url = "https://github.com/DavHau/mach-nix/";
    # place version number with the latest one from the github releases page
    ref = "refs/tags/3.5.0";
  }) {
	pypiDataRev="7ceb54907964d32f6bf8ee702e3a8f7d87d39bed";
	pypiDataSha256="sha256:1v6sh7a4ffan8g4fpw94mq4piy680l9npmwncsirxp469qywj6dw";
};
in
mach-nix.mkPython {
  requirements = builtins.readFile ./requirements.txt;
}
