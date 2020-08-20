/* Copyright (c) 2015-2019, Chandan B.N.
 *
 * Copyright (c) 2019, FIRST.ORG, INC
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 *    disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 *    following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
 *    products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*

CVSSjs Version 0.1 beta

Usage:
    craete an html element with an id for eg.,
    <div id="cvssboard"></div>

    // create a new instance of CVSS calculator:
    var c = new CVSS("cvssboard");

    // create a new instance of CVSS calculator with some event handler callbacks
    var c = new CVSS("cvssboard", {
                onchange: function() {....} //optional
                onsubmit: function() {....} //optional
                }
                
    // set a vector
    c.set('AV:L/AC:L/PR:N/UI:N/S:C/C:N/I:N/A:L');
    
    //get the value
    c.get() returns an object like:

    {
        score: 4.3,
        vector: 'AV:L/AC:L/PR:N/UI:N/S:C/C:N/I:N/A:L'
    }
    
*/

var CVSS = function (id, options) {
    this.options = options;
    this.wId = id;
    var e = function (tag) {
        return document.createElement(tag);
    };

    // Base Group
    this.bg = {
        AV: 'Vector de origen del Ataque',
        AC: 'Complejidad',
        PR: 'Privilegios Requeridos',
        UI: 'Interacción de Usuario',
        S: 'Impacto: Alcance',
        C: 'Impacto: Confidencialidad',
        I: 'Impacto: Integridad',
        A: 'Impacto: Disponibilidad'
    };

    // Base Metrics
    this.bm = {
        AV: {
            N: {
                l: 'Red: Internet',
                d: "La vulnerabilidad puede ser explotada remotamente desde Internet, atravezando diferentes capas por uno o mas routers."
            },
            A: {
                l: 'Red: Local',
                d: "La explotación es realizable desde la Red local ya sea fisica o por software como VPN, MPLS o IPsec."
            },
            L: {
                l: 'Local',
                d: "Para realizar la explotación, el atacante debe tener acceso local por medio de interacción directa ya sea por teclado o bien con una sesión iniciada como por ejemplo SSH o RDP."
            },
            P: {
                l: 'Físico',
                d: "Requiere la manipulación fisica del componente vulnerable, generalmente ataques MiTM Físicos como por ejemplo adulterar teclados, puertos USB o otros periféricos"
            }
        },
        AC: {
            L: {
                l: 'Baja',
                d: "No requiere gran experiencia o conocimiento especializado para lograr la explotación con poco esfuerzo"
            },
            H: {
                l: 'Alta',
                d: "Se requiere experiencia y un nivel de conocimiento mayor sobre el componente vulnerable, generalmente se debe investigar antes de poder lograr una explotación completa"
            }
        },
        PR: {
            N: {
                l: 'Ninguno',
                d: "No requiere acceso previo a los archivos o configuraciones del sistema vulnerable para realizar el ataque"
            },
            L: {
                l: 'Básico',
                d: "Requiere acceso básico previo al sistema, generalmente acceso limitado con la posibilidad que el atacante logre elevar privilegios"
            },
            H: {
                l: 'Administrativos',
                d: "Requiere acceso avanzado o de administrador al sistema lo que le permite tener un completo control sobre el componente vulnerable"
            }
        },
        UI: {
            N: {
                l: 'Ninguna',
                d: "La explotación se logra sin la interacción de ningun usuario"
            },
            R: {
                l: 'Requerida',
                d: "La explotación requiere la acción de un usuario antes de completarse, como por ejemplo la instalación de un Software o la modificación de permisos."
            }
        },

        S: {
            C: {
                l: 'Múltiple',
                d: "La explotación de la vulnerabilidad puede comprometer adicionalmente la seguridad de otros recursos y componentes que no se relacionan directamente con el componente vulnerable."
            },
            U: {
                l: 'Específico',
                d: "La explotación solo compromete la seguridad de los recursos directamente relacionados al componente vulnerable."
            }
        },
        C: {
            H: {
                l: 'Alto',
                d: "Exposición completa y pérdida total de la confidencialidad, como por ejemplo el robo de credenciales administrativas."
            },
            L: {
                l: 'Bajo',
                d: "El atacante logra obtener acceso a ciertos archivos comprometiendo la confidencialidad pero no logra tener el control total del componente vulnerable."
            },
            N: {
                l: 'Ninguno',
                d: "No existe compromiso de la confidencialidad."
            }
        },
        I: {
            H: {
                l: 'Alto',
                d: "Compromiso total de integridad, el atacante puede modificar cualquier archivo y/o configuración que dependan del componente explotado"
            },
            L: {
                l: 'Bajo',
                d: "El atacante logra modificar datos comprometiendo la integridad pero no tiene control sobre el sistema ni del alcance de las modificaciones, el impacto es limitado."
            },
            N: {
                l: 'Ninguno',
                d: "No existe compromiso de integridad"
            }
        },
        A: {
            H: {
                l: 'Alto',
                d: "Compromiso total de la disponibilidad, el atacante causa la denegación completa a los recursos del componente explotado, la denegación se puede lograr con un único ataque o con ataques Múltiples."
            },
            L: {
                l: 'Bajo',
                d: "El atacante logra comprometer la disponibilidad de manera parcial o por espacios limitados de tiempo, pero no tiene la posibilidad de generar una denegación total."
            },
            N: {
                l: 'Ninguno',
                d: "No existe compromiso de disponibilidad."
            }
        }
    };
    
    this.bme = {};
    this.bmgReg = {
        AV: 'NALP',
        AC: 'LH',
        PR: 'NLH',
        UI: 'NR',
        S: 'CU',
        C: 'HLN',
        I: 'HLN',
        A: 'HLN'
    };
    this.bmoReg = {
        AV: 'NALP',
        AC: 'LH',
        C: 'C',
        I: 'C',
        A: 'C'
    };
    var s, f, dl, g, dd, l;
    this.el = document.getElementById(id);
    this.el.appendChild(s = e('style'));
    s.innerHTML = '';
    this.el.appendChild(f = e('form'));
    f.className = 'cvssjs';
    this.calc = f;
    for (g in this.bg) {
        f.appendChild(dl = e('dl'));
        dl.setAttribute('class', g);
        var dt = e('dt');
        dt.innerHTML = this.bg[g];
        dl.appendChild(dt);
        for (s in this.bm[g]) {
            dd = e('dd');
            dl.appendChild(dd);
            var inp = e('input');
            inp.setAttribute('name', g);
            inp.setAttribute('value', s);
            inp.setAttribute('id', id + g + s);
            inp.setAttribute('class', g + s);
            //inp.setAttribute('ontouchstart', '');
            inp.setAttribute('type', 'radio');
            this.bme[g + s] = inp;
            var me = this;
            inp.onchange = function () {
                me.setMetric(this);
            };
            dd.appendChild(inp);
            l = e('label');
            dd.appendChild(l);
            l.setAttribute('for', id + g + s);
            l.appendChild(e('i')).setAttribute('class', g + s);
            l.appendChild(document.createTextNode(this.bm[g][s].l + ' '));
            dd.appendChild(e('small')).innerHTML = this.bm[g][s].d;
        }
    }
    //f.appendChild(e('hr'));
    f.appendChild(dl = e('dl'));
    dl.innerHTML = '<dt>Nivel de Riesgo&sdot;Puntaje&sdot;Vector</dt>';
    dd = e('dd');
    dl.appendChild(dd);
    l = dd.appendChild(e('label'));
    l.className = 'results';
    l.appendChild(this.severity = e('span'));
    this.severity.className = 'severity';
    l.appendChild(this.score = e('span'));
    this.score.className = 'score';
    l.appendChild(document.createTextNode(' '));
    l.appendChild(this.vector = e('a'));
    this.vector.className = 'vector';
    this.vector.innerHTML = 'CVSS:3.1/AV:_/AC:_/PR:_/UI:_/S:_/C:_/I:_/A:_';
    
    if (options.onsubmit) {
        f.appendChild(e('hr'));
        this.submitButton = f.appendChild(e('input'));
        this.submitButton.setAttribute('type', 'submit');
        this.submitButton.onclick = options.onsubmit;
    }
};

CVSS.prototype.severityRatings = [{
    name: "Ninguno",
    bottom: 0.0,
    top: 0.0
}, {
    name: "Bajo",
    bottom: 0.1,
    top: 3.9
}, {
    name: "Medio",
    bottom: 4.0,
    top: 6.9
}, {
    name: "Alto",
    bottom: 7.0,
    top: 8.9
}, {
    name: "Crí­tico",
    bottom: 9.0,
    top: 10.0
}];

CVSS.prototype.severityRating = function (score) {
    var i;
    var severityRatingLength = this.severityRatings.length;
    for (i = 0; i < severityRatingLength; i++) {
        if (score >= this.severityRatings[i].bottom && score <= this.severityRatings[i].top) {
            return this.severityRatings[i];
        }
    }
    return {
        name: "Ninguno",
        bottom: '0',
        top: '0'
    };
};

CVSS.prototype.valueofradio = function(e) {
    for(var i = 0; i < e.length; i++) {
        if (e[i].checked) {
            return e[i].value;
        }
    }
    return null;
};

CVSS.prototype.calculate = function () {
    var cvssVersion = "3.1";
    var exploitabilityCoefficient = 8.22;
    var scopeCoefficient = 1.08;

    // Define associative arrays mapping each metric value to the constant used in the CVSS scoring formula.
    var Weight = {
        AV: {
            N: 0.85,
            A: 0.62,
            L: 0.55,
            P: 0.2
        },
        AC: {
            H: 0.44,
            L: 0.77
        },
        PR: {
            U: {
                N: 0.85,
                L: 0.62,
                H: 0.27
            },
            // These values are used if Scope is Unchanged
            C: {
                N: 0.85,
                L: 0.68,
                H: 0.5
            }
        },
        // These values are used if Scope is Changed
        UI: {
            N: 0.85,
            R: 0.62
        },
        S: {
            U: 6.42,
            C: 7.52
        },
        C: {
            N: 0,
            L: 0.22,
            H: 0.56
        },
        I: {
            N: 0,
            L: 0.22,
            H: 0.56
        },
        A: {
            N: 0,
            L: 0.22,
            H: 0.56
        }
        // C, I and A have the same weights

    };

    var p;
    var val = {}, metricWeight = {};
    try {
        for (p in this.bg) {
            val[p] = this.valueofradio(this.calc.elements[p]);
            if (typeof val[p] === "undefined" || val[p] === null) {
                return "0";
            }
            metricWeight[p] = Weight[p][val[p]];
        }
    } catch (err) {
        return err; // TODO: need to catch and return sensible error value & do a better job of specifying *which* parm is at fault.
    }
    metricWeight.PR = Weight.PR[val.S][val.PR];
    //
    // CALCULATE THE CVSS BASE SCORE
    //
    var roundUp1 = function Roundup(input) {
        var int_input = Math.round(input * 100000);
        if (int_input % 10000 === 0) {
            return int_input / 100000
        } else {
            return (Math.floor(int_input / 10000) + 1) / 10
        }
    };
    try {
    var baseScore, impactSubScore, impact, exploitability;
    var impactSubScoreMultiplier = (1 - ((1 - metricWeight.C) * (1 - metricWeight.I) * (1 - metricWeight.A)));
    if (val.S === 'U') {
        impactSubScore = metricWeight.S * impactSubScoreMultiplier;
    } else {
        impactSubScore = metricWeight.S * (impactSubScoreMultiplier - 0.029) - 3.25 * Math.pow(impactSubScoreMultiplier - 0.02, 15);
    }
    var exploitabalitySubScore = exploitabilityCoefficient * metricWeight.AV * metricWeight.AC * metricWeight.PR * metricWeight.UI;
    if (impactSubScore <= 0) {
        baseScore = 0;
    } else {
        if (val.S === 'U') {
            baseScore = roundUp1(Math.min((exploitabalitySubScore + impactSubScore), 10));
        } else {
            baseScore = roundUp1(Math.min((exploitabalitySubScore + impactSubScore) * scopeCoefficient, 10));
        }
    }

    return baseScore.toFixed(1);
    } catch (err) {
        return err;
    }
};

CVSS.prototype.get = function() {
    return {
        score: this.score.innerHTML,
        vector: this.vector.innerHTML
    };
};

CVSS.prototype.setMetric = function(a) {
    var vectorString = this.vector.innerHTML;
    if (/AV:.\/AC:.\/PR:.\/UI:.\/S:.\/C:.\/I:.\/A:./.test(vectorString)) {} else {
        vectorString = 'AV:_/AC:_/PR:_/UI:_/S:_/C:_/I:_/A:_';
    }
    //e("E" + a.id).checked = true;
    var newVec = vectorString.replace(new RegExp('\\b' + a.name + ':.'), a.name + ':' + a.value);
    this.set(newVec);
};

CVSS.prototype.set = function(vec) {
    var newVec = 'CVSS:3.1/';
    var sep = '';
    for (var m in this.bm) {
        var match = (new RegExp('\\b(' + m + ':[' + this.bmgReg[m] + '])')).exec(vec);
        if (match !== null) {
            var check = match[0].replace(':', '');
            this.bme[check].checked = true;
            newVec = newVec + sep + match[0];
        } else if ((m in {C:'', I:'', A:''}) && (match = (new RegExp('\\b(' + m + ':C)')).exec(vec)) !== null) {
            // compatibility with v2 only for CIA:C
            this.bme[m + 'H'].checked = true;
            newVec = newVec + sep + m + ':H';
        } else {
            newVec = newVec + sep + m + ':_';
            for (var j in this.bm[m]) {
                this.bme[m + j].checked = false;
            }
        }
        sep = '/';
    }
    this.update(newVec);
};

CVSS.prototype.update = function(newVec) {
    this.vector.innerHTML = newVec;
    var s = this.calculate();
    this.score.innerHTML = s;
    var rating = this.severityRating(s);
    this.severity.className = rating.name + ' severity';
    this.severity.innerHTML = rating.name + '<sub>' + rating.bottom + ' - ' + rating.top + '</sub>';
    this.severity.title = rating.bottom + ' - ' + rating.top;
    if (this.options !== undefined && this.options.onchange !== undefined) {
        this.options.onchange();
    }
};