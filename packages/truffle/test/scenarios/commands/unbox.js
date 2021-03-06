const assert = require("assert");
const CommandRunner = require("../commandrunner");
const MemoryLogger = require("../memorylogger");
const fse = require("fs-extra");
const tmp = require("tmp");
const path = require("path");
const Config = require("@truffle/config");

describe("truffle unbox [ @standalone ]", () => {
  let config;
  const logger = new MemoryLogger();

  beforeEach("set up config for logger", () => {
    tempDir = tmp.dirSync({ unsafeCleanup: true });
    config = { working_directory: tempDir.name };
    config.logger = logger;
    config = Config.default().merge(config);
  });

  afterEach("clear working_directory", () => {
    tempDir.removeCallback();
  });

  describe("when run without arguments", () => {
    it("unboxes truffle-init-default", done => {
      CommandRunner.run("unbox --force", config, () => {
        assert(
          fse.pathExistsSync(
            path.join(tempDir.name, "contracts", "ConvertLib.sol")
          ),
          "ConvertLib.sol does not exist"
        );
        assert(
          fse.pathExistsSync(
            path.join(tempDir.name, "contracts", "Migrations.sol")
          ),
          "Migrations.sol does not exist"
        );
        assert(
          fse.pathExistsSync(
            path.join(tempDir.name, "contracts", "MetaCoin.sol")
          ),
          "MetaCoin.sol does not exist"
        );
        done();
      });
    }).timeout(20000);
  });

  describe("when run with arguments", () => {
    describe("valid input", () => {
      describe("full url", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox https://github.com/truffle-box/bare-box",
            config,
            () => {
              assert(
                fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("full url + branch", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox https://github.com/truffle-box/bare-box#truffle-test-branch",
            config,
            () => {
              assert(
                fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("full url + branch + relativePath", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox https://github.com/truffle-box/bare-box#truffle-test-branch:path/to/subDir --force",
            config,
            () => {
              assert(
                fse.existsSync(
                  path.join(
                    tempDir.name,
                    "path",
                    "to",
                    "subDir",
                    "truffle-config.js"
                  )
                )
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("origin/master", () => {
        it("unboxes successfully", done => {
          CommandRunner.run("unbox truffle-box/bare-box", config, () => {
            assert(
              fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
            );
            done();
          });
        }).timeout(20000);
      });

      describe("origin/master#branch", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox truffle-box/bare-box#truffle-test-branch",
            config,
            () => {
              assert(
                fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("origin/master#branch:relativePath", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox truffle-box/bare-box#truffle-test-branch:path/to/subDir --force",
            config,
            () => {
              assert(
                fse.existsSync(
                  path.join(
                    tempDir.name,
                    "path",
                    "to",
                    "subDir",
                    "truffle-config.js"
                  )
                )
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("official truffle box", () => {
        it("unboxes successfully", done => {
          CommandRunner.run("unbox bare", config, () => {
            assert(
              fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
            );
            done();
          });
        }).timeout(20000);
      });

      describe("official truffle-box", () => {
        it("unboxes successfully", done => {
          CommandRunner.run("unbox bare-box", config, () => {
            assert(
              fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
            );
            done();
          });
        }).timeout(20000);
      });

      describe("official truffle box + branch", () => {
        it("unboxes successfully", done => {
          CommandRunner.run("unbox bare#truffle-test-branch", config, () => {
            assert(
              fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
            );
            done();
          });
        }).timeout(20000);
      });

      describe("official truffle box + branch + relativePath", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox bare#truffle-test-branch:path/to/subDir --force",
            config,
            () => {
              assert(
                fse.existsSync(
                  path.join(
                    tempDir.name,
                    "path",
                    "to",
                    "subDir",
                    "truffle-config.js"
                  )
                )
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("git@ ssh", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox git@github.com:truffle-box/bare-box",
            config,
            () => {
              assert(
                fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("with an invalid git@ ssh", () => {
        it("logs an error", done => {
          CommandRunner.run(
            "unbox git@github.com:truffle-box/bare-boxer",
            config,
            () => {
              const output = logger.contents();
              assert(output.includes("doesn't exist."));
              done();
            }
          );
        }).timeout(20000);
      });

      describe("git@ ssh + branch", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox git@github.com:truffle-box/bare-box#truffle-test-branch",
            config,
            () => {
              assert(
                fse.existsSync(path.join(tempDir.name, "truffle-config.js"))
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("git@ ssh + branch + relativePath", () => {
        it("unboxes successfully", done => {
          CommandRunner.run(
            "unbox git@github.com:truffle-box/bare-box#truffle-test-branch:path/to/subDir --force",
            config,
            () => {
              assert(
                fse.existsSync(
                  path.join(
                    tempDir.name,
                    "path",
                    "to",
                    "subDir",
                    "truffle-config.js"
                  )
                )
              );
              done();
            }
          );
        }).timeout(20000);
      });

      describe("when run with a path", () => {
        it("unboxes successfully to the specified path", done => {
          const myPath = "./candy/cane/lane";
          CommandRunner.run(
            `unbox truffle-box/bare-box ${myPath}`,
            config,
            error => {
              if (error) done(error);
              assert(
                fse.pathExistsSync(
                  path.join(tempDir.name, myPath, "truffle-config.js")
                )
              );
              done();
            }
          );
        }).timeout(20000);
      });
    });

    describe("with invalid input", () => {
      describe("invalid full url", () => {
        it("throws an error", done => {
          CommandRunner.run(
            "unbox https://github.com/truffle-box/bare-boxing",
            config,
            () => {
              const output = logger.contents();
              assert(output.includes("doesn't exist."));
              done();
            }
          );
        }).timeout(20000);
      });

      describe("invalid origin/master", () => {
        it("throws an error", done => {
          CommandRunner.run("unbox truffle-box/bare-boxer", config, () => {
            const output = logger.contents();
            assert(output.includes("doesn't exist."));
            done();
          });
        }).timeout(20000);
      });

      describe("invalid official truffle box", () => {
        it("throws an error", done => {
          CommandRunner.run("unbox barer", config, () => {
            const output = logger.contents();
            assert(output.includes("doesn't exist."));
            done();
          });
        }).timeout(20000);
      });

      describe("invalid git@ ssh", () => {
        it("throws an error", done => {
          CommandRunner.run(
            "unbox git@github.com:truffle-box/bare-boxer",
            config,
            () => {
              const output = logger.contents();
              assert(output.includes("doesn't exist."));
              done();
            }
          );
        }).timeout(20000);
      });

      describe("absolutePaths", () => {
        it("throws an error", done => {
          CommandRunner.run("unbox bare:/path/to/subDir", config, () => {
            const output = logger.contents();
            assert(output.includes("not allowed!"));
            done();
          });
        }).timeout(20000);
      });

      describe("invalid box format", () => {
        it("throws an error", done => {
          CommandRunner.run("unbox /bare/", config, () => {
            const output = logger.contents();
            assert(output.includes("invalid format"));
            done();
          });
        }).timeout(20000);
      });
    });
  });
});
