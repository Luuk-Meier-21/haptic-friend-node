function ActionsController(ws, sp) {
    this.ws = ws;
    this.sp = sp;
    this.actionStack = [
        new Action(this.sp, this.ws, 5000)
    ]

    this.add = (actionTime) => {
        this.actionStack.push(new Action(sp, ws, actionTime))
    }

    this.start = () => {
        action.start();
    }
    this.confirm = () => {
        action.confirm();
    }
    // For other unknown endings of actions:
    this.end = (succes) => {
        action.end(succes)
    }
}

/**
 * A new action creates feedback for a user that they then need to confirm within the given time.
 */
function Action(sp, ws, time) {
    this.sp = sp;
    this.ws = ws;
    this.time = time;
    this.succes = false;
    this.state = "pending"

    /**
     * Game has started the action.
     * Vibrations start, music stops.
     */
    this.start = () => {
        console.log("Action start")
        this.state = "started"
        sp.write("1");
        setTimeout(() => this.end(false), this.time);
    }

    /**
     * User confirms action by pressing button.
     * 
     */
    this.confirm = () => {
        if (this.state === "started") {
            console.log("confirm");
            this.state = "confirmed";
            this.end(true);
        }
    }
    
    /**
     * Game has ended the action
     */
    this.end = (succes) => {
        if (this.state === "started" || this.state === "confirmed") {
            console.log("Action end");
            this.succes = succes;
            this.state = "finished";
            sp.write("0");
        }
    }
}


module.exports = {
    ActionsController: ActionsController
}
  