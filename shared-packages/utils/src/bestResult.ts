import { Result } from '@competition-manager/schemas';

export const bestResult = (results: Result[]) => {
    const type = results[0].type;
    let bestPerf:Result = results[0];
    for (let i = 1; i < results.length; i++) {
        if (type == "Time"){
            if (bestPerf.perf > results[i].perf){
                bestPerf = results[i];
            }
        } else {
            if (bestPerf.perf < results[i].perf){
                bestPerf = results[i];
            }
        }
    }
    return bestPerf
};



