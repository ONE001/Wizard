function Wizard(obj) {
    if (!(this instanceof Wizard))
        return new Wizard(obj);

    if (!obj || typeof obj !== "object")
        throw new Error("arguments must be an object");

    var matches = (function(doc) {
        return doc.matchesSelector ||
            doc.webkitMatchesSelector ||
            doc.mozMatchesSelector ||
            doc.oMatchesSelector ||
            doc.msMatchesSelector
        ;
    })(document.documentElement);

    this.wizard = obj.element;
    this.active = obj.active || 1;
    this.steps = obj.steps || [];

    this.data = (function() {
        var data = {};

        return {
            get: function() {
                if (!arguments.length)
                    return data;

                return data[arguments[0]];
            },
            set: function(key, value) {
                data[key] = value;
            },
        };
    }());

    if (!this.wizard || !(this.wizard instanceof HTMLElement))
        this.wizard = document.createElement("div");

    if (this.active === 0 || this.active > this.steps.length)
        this.active = 1;

    this.wizard.innerHTML = '';
    this.wizard.id = "wizard";

    var steps_panel_active = function(){},
        buttons_state = function(){};

    this.steps_panel = function() {
        var that = this;
        if (!obj.steps_panel)
            return false;

        var steps_panel = document.createElement("div"),
            current_step;

        steps_panel_active = function(inx) {
            var current_active = steps_panel.querySelector(".active");
            if (current_active) current_active.classList.remove("active");
            if (steps_panel.childNodes[inx - 1]) steps_panel.childNodes[inx - 1].classList.add("active");
        };

        this.wizard.appendChild(steps_panel);
        steps_panel.classList.add("wizard_steps_panel");
        steps_panel.style.width = "100%";

        this.steps.forEach(function(step, inx) {
            current_step = document.createElement("div");
            current_step.innerHTML = step.title || '';
            current_step.n = inx + 1;
            steps_panel.appendChild(current_step);
        });

        steps_panel_active(this.active);

        steps_panel.addEventListener("click", function(event) {
            var self = event.target;
            if (!matches.call(self, ".wizard_steps_panel > div"))
                return false;

            that.step.call(that, self.n);
        }, false);

        this.steps_panel = steps_panel;
    };

    this.wizard_body = function() {
        var wizard_body = document.createElement("div");
        wizard_body.classList.add("wizard_body");
        this.wizard.appendChild(wizard_body);
        wizard_body.style.width = "100%";
        this.wizard_body = wizard_body;
    };

    this.buttons = function() {
        var buttons_panel = document.createElement("div"),
            that = this,
            buttons = (function() {
                var prev = document.createElement("button"),
                    next = document.createElement("button"),
                    finish = document.createElement("button");

                prev.classList.add("wizard_prev");
                prev.innerHTML = "Prev";
                next.classList.add("wizard_next");
                next.innerHTML = "Next";
                finish.classList.add("wizard_finish");
                finish.innerHTML = "Finish";

                return {
                    prev: prev,
                    next: next,
                    finish: finish,
                };
            }.call(this))
        ;

        buttons_panel.appendChild(buttons.prev);
        buttons_panel.appendChild(buttons.next);
        buttons_panel.appendChild(buttons.finish);

        buttons_state = function() {
            buttons.prev.setAttribute("disabled", true);
            buttons.next.setAttribute("disabled", true);
            buttons.finish.setAttribute("disabled", true);
            // next
            if (this.active <= this.steps.length && this.active >= 1)
                buttons.next.removeAttribute("disabled");

            // prev
            if (this.active != 1)
                buttons.prev.removeAttribute("disabled");

            // finish
            if (this.active > this.steps.length)
                buttons.finish.removeAttribute("disabled");
        };

        buttons_panel.addEventListener("click", function(event) {
            var self = event.target;
            if (!matches.call(self, ".wizard_buttons_panel button:not([disabled])"))
                return false;

            if (matches.call(self, ".wizard_next"))
                that.next.call(that);
            else if (matches.call(self, ".wizard_prev"))
                that.prev.call(that);
            else if (matches.call(self, ".wizard_finish"))
                obj.finish && obj.finish.call(that);
        });

        buttons_panel.classList.add("wizard_buttons_panel");
        this.wizard.appendChild(buttons_panel);
        buttons_state.call(this);

        this.buttons = buttons_panel;
    };

    this.current_step = function() {
        return this.steps[this.active - 1];
    };

    this.step = function(n) {
        if (!n || n <= 0)
            return false;

        if (n > this.steps.length)
            this.active = this.steps.length + 1;

        this.active = n;
        steps_panel_active.call(this, n);
        buttons_state.call(this);

        var current_step = this.current_step();
        if (current_step) {
            var section = document.createElement("section");
            this.wizard_body.innerHTML = '';
            section.innerHTML = current_step.body || '';
            this.wizard_body.appendChild(section);
            current_step.init && current_step.init.call(this, this.active, section);
        }
    };

    this.next = function() {
        var current_step = this.current_step();

        if (!current_step) return;

        if (current_step.next && !current_step.next.call(this, this.active))
            return false;

        this.step(this.active + 1);

        if (obj.history)
            history.pushState({ step: this.active }, null, this.active);
    };

    this.prev = function() {
        this.step(this.active - 1);
    };

    this.init = function() {
        this.steps_panel();
        this.wizard_body();
        this.buttons();
        this.step(this.active);

        if (obj.history) {
            var that = this;
            window.addEventListener("popstate", function(e) {
                var step = e.state && e.state.step ? e.state.step : 1;
                that.step(step);
            }, false);
        }
    };

    this.init();
}
