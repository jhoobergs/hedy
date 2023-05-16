// The worker has its own scope and no direct access to functions/objects of the
// global scope. We import the generated JS file to make `wasm_bindgen`
// available which we need to initialize our WASM code.
importScripts('/vendor/ampersand_wasm.js');

//console.log('Initializing worker')

const { L1StepExecutor, L2StepExecutor, L3StepExecutor } = wasm_bindgen;

async function init_wasm_in_worker() {
    // Load the wasm file by awaiting the Promise returned by `wasm_bindgen`.
    await wasm_bindgen('/vendor/ampersand_wasm_bg.wasm');

    console.log("Running");

    self.postMessage({ type: "worker_is_ready" });

    let executor = undefined;
    let run_type = "run";

    // Set callback to handle messages passed to the worker.
    self.onmessage = async event => {
        console.log(event.data)

        if (event.data.type === "set_step_by_step") {
            if (event.data.value) {
                run_type = "step"
            } else {
                run_type = "value"
            }
            return
        }

        if (event.data.type === "run") {
            executor = new L1StepExecutor(event.data.code);
        } else if (event.data.type === "run_ast") {
            console.log("Loading");
            console.log(event.data.ast);
            if (event.data.level === 1) { // TODO: add a HedyStepExecutor in ampersand-wasm that does the level checking internal?
                executor = L1StepExecutor.from_json(event.data.ast);
            } else if (event.data.level === 2) {
                executor = L2StepExecutor.from_json(event.data.ast);
            }  else if (event.data.level === 3) {
                executor = L3StepExecutor.from_json(event.data.ast);
            }
            console.log("parsed");
        } else if (event.data.type === "input") {
            executor.add_input(event.data.input);
        }

        if (run_type === "step") {
            executor = executor.next();
        } else {
            executor = executor.next_syscall();
        }
        let stepped_last_result = executor.last_result;
        self.postMessage(stepped_last_result);
    }
};

init_wasm_in_worker();

