// To parse this data:
//
//   import { Convert } from "./file";
//
//   const iTracker = Convert.toITracker(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ITracker {
    canon:                 boolean;
    modreward:             boolean;
    name:                  string;
    portrait_bounty:       { [key: string]: number };
    portrait_complete:     number;
    portrait_credit:       Credit;
    portrait_files:        { [key: string]: boolean };
    portrait_link:         string;
    portrait_modified:     string;
    portrait_pending:      PortraitPending;
    portrait_recolor_link: string;
    portrait_required:     boolean;
    sprite_bounty:         { [key: string]: number };
    sprite_complete:       number;
    sprite_credit:         Credit;
    sprite_files:          { [key: string]: boolean };
    sprite_link:           string;
    sprite_modified:       string;
    sprite_pending:        { [key: string]: number };
    sprite_recolor_link:   string;
    sprite_required:       boolean;
    subgroups:             { [key: string]: ITrackerSubgroup };
}

export interface Credit {
    primary:   string;
    secondary: string[];
    total:     number;
}

export interface PortraitPending {
}

export interface ITrackerSubgroup {
    canon:                 boolean;
    modreward:             boolean;
    name:                  string;
    portrait_bounty:       { [key: string]: number };
    portrait_complete:     number;
    portrait_credit:       Credit;
    portrait_files:        { [key: string]: boolean };
    portrait_link:         string;
    portrait_modified:     string;
    portrait_pending:      PortraitPending;
    portrait_recolor_link: string;
    portrait_required:     boolean;
    sprite_bounty:         SpriteBounty;
    sprite_complete:       number;
    sprite_credit:         Credit;
    sprite_files:          string[] | { [key: string]: boolean };
    sprite_link:           string;
    sprite_modified:       string;
    sprite_pending:        PortraitPending;
    sprite_recolor_link:   string;
    sprite_required:       boolean;
    subgroups:             { [key: string]: SubgroupSubgroup };
}

export interface SpriteBounty {
    "1"?: number;
}

export interface SubgroupSubgroup {
    canon:                 boolean;
    modreward:             boolean;
    name:                  Name;
    portrait_bounty:       PortraitPending;
    portrait_complete:     number;
    portrait_credit:       Credit;
    portrait_files:        { [key: string]: boolean };
    portrait_link:         string;
    portrait_modified:     string;
    portrait_pending:      PortraitPending;
    portrait_recolor_link: string;
    portrait_required:     boolean;
    sprite_bounty:         PortraitPending;
    sprite_complete:       number;
    sprite_credit:         Credit;
    sprite_files:          { [key: string]: boolean };
    sprite_link:           string;
    sprite_modified:       string;
    sprite_pending:        PortraitPending;
    sprite_recolor_link:   string;
    sprite_required:       boolean;
    subgroups:             Subgroups;
}

export enum Name {
    Empty = "",
    Female = "Female",
    Shiny = "Shiny",
}

export interface Subgroups {
    "0002"?: The0002;
}

export interface The0002 {
    canon:                 boolean;
    modreward:             boolean;
    name:                  Name;
    portrait_bounty:       { [key: string]: number };
    portrait_complete:     number;
    portrait_credit:       Credit;
    portrait_files:        { [key: string]: boolean };
    portrait_link:         string;
    portrait_modified:     string;
    portrait_pending:      PortraitPending;
    portrait_recolor_link: string;
    portrait_required:     boolean;
    sprite_bounty:         PortraitPending;
    sprite_complete:       number;
    sprite_credit:         Credit;
    sprite_files:          { [key: string]: boolean };
    sprite_link:           string;
    sprite_modified:       string;
    sprite_pending:        PortraitPending;
    sprite_recolor_link:   string;
    sprite_required:       boolean;
    subgroups:             PortraitPending;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toITracker(json: string): { [key: string]: ITracker } {
        return cast(JSON.parse(json), m(r("ITracker")));
    }

    public static iTrackerToJson(value: { [key: string]: ITracker }): string {
        return JSON.stringify(uncast(value, m(r("ITracker"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ITracker": o([
        { json: "canon", js: "canon", typ: true },
        { json: "modreward", js: "modreward", typ: true },
        { json: "name", js: "name", typ: "" },
        { json: "portrait_bounty", js: "portrait_bounty", typ: m(0) },
        { json: "portrait_complete", js: "portrait_complete", typ: 0 },
        { json: "portrait_credit", js: "portrait_credit", typ: r("Credit") },
        { json: "portrait_files", js: "portrait_files", typ: m(true) },
        { json: "portrait_link", js: "portrait_link", typ: "" },
        { json: "portrait_modified", js: "portrait_modified", typ: "" },
        { json: "portrait_pending", js: "portrait_pending", typ: r("PortraitPending") },
        { json: "portrait_recolor_link", js: "portrait_recolor_link", typ: "" },
        { json: "portrait_required", js: "portrait_required", typ: true },
        { json: "sprite_bounty", js: "sprite_bounty", typ: m(0) },
        { json: "sprite_complete", js: "sprite_complete", typ: 0 },
        { json: "sprite_credit", js: "sprite_credit", typ: r("Credit") },
        { json: "sprite_files", js: "sprite_files", typ: m(true) },
        { json: "sprite_link", js: "sprite_link", typ: "" },
        { json: "sprite_modified", js: "sprite_modified", typ: "" },
        { json: "sprite_pending", js: "sprite_pending", typ: m(0) },
        { json: "sprite_recolor_link", js: "sprite_recolor_link", typ: "" },
        { json: "sprite_required", js: "sprite_required", typ: true },
        { json: "subgroups", js: "subgroups", typ: m(r("ITrackerSubgroup")) },
    ], false),
    "Credit": o([
        { json: "primary", js: "primary", typ: "" },
        { json: "secondary", js: "secondary", typ: a("") },
        { json: "total", js: "total", typ: 0 },
    ], false),
    "PortraitPending": o([
    ], false),
    "ITrackerSubgroup": o([
        { json: "canon", js: "canon", typ: true },
        { json: "modreward", js: "modreward", typ: true },
        { json: "name", js: "name", typ: "" },
        { json: "portrait_bounty", js: "portrait_bounty", typ: m(0) },
        { json: "portrait_complete", js: "portrait_complete", typ: 0 },
        { json: "portrait_credit", js: "portrait_credit", typ: r("Credit") },
        { json: "portrait_files", js: "portrait_files", typ: m(true) },
        { json: "portrait_link", js: "portrait_link", typ: "" },
        { json: "portrait_modified", js: "portrait_modified", typ: "" },
        { json: "portrait_pending", js: "portrait_pending", typ: r("PortraitPending") },
        { json: "portrait_recolor_link", js: "portrait_recolor_link", typ: "" },
        { json: "portrait_required", js: "portrait_required", typ: true },
        { json: "sprite_bounty", js: "sprite_bounty", typ: r("SpriteBounty") },
        { json: "sprite_complete", js: "sprite_complete", typ: 0 },
        { json: "sprite_credit", js: "sprite_credit", typ: r("Credit") },
        { json: "sprite_files", js: "sprite_files", typ: u(a(""), m(true)) },
        { json: "sprite_link", js: "sprite_link", typ: "" },
        { json: "sprite_modified", js: "sprite_modified", typ: "" },
        { json: "sprite_pending", js: "sprite_pending", typ: r("PortraitPending") },
        { json: "sprite_recolor_link", js: "sprite_recolor_link", typ: "" },
        { json: "sprite_required", js: "sprite_required", typ: true },
        { json: "subgroups", js: "subgroups", typ: m(r("SubgroupSubgroup")) },
    ], false),
    "SpriteBounty": o([
        { json: "1", js: "1", typ: u(undefined, 0) },
    ], false),
    "SubgroupSubgroup": o([
        { json: "canon", js: "canon", typ: true },
        { json: "modreward", js: "modreward", typ: true },
        { json: "name", js: "name", typ: r("Name") },
        { json: "portrait_bounty", js: "portrait_bounty", typ: r("PortraitPending") },
        { json: "portrait_complete", js: "portrait_complete", typ: 0 },
        { json: "portrait_credit", js: "portrait_credit", typ: r("Credit") },
        { json: "portrait_files", js: "portrait_files", typ: m(true) },
        { json: "portrait_link", js: "portrait_link", typ: "" },
        { json: "portrait_modified", js: "portrait_modified", typ: "" },
        { json: "portrait_pending", js: "portrait_pending", typ: r("PortraitPending") },
        { json: "portrait_recolor_link", js: "portrait_recolor_link", typ: "" },
        { json: "portrait_required", js: "portrait_required", typ: true },
        { json: "sprite_bounty", js: "sprite_bounty", typ: r("PortraitPending") },
        { json: "sprite_complete", js: "sprite_complete", typ: 0 },
        { json: "sprite_credit", js: "sprite_credit", typ: r("Credit") },
        { json: "sprite_files", js: "sprite_files", typ: m(true) },
        { json: "sprite_link", js: "sprite_link", typ: "" },
        { json: "sprite_modified", js: "sprite_modified", typ: "" },
        { json: "sprite_pending", js: "sprite_pending", typ: r("PortraitPending") },
        { json: "sprite_recolor_link", js: "sprite_recolor_link", typ: "" },
        { json: "sprite_required", js: "sprite_required", typ: true },
        { json: "subgroups", js: "subgroups", typ: r("Subgroups") },
    ], false),
    "Subgroups": o([
        { json: "0002", js: "0002", typ: u(undefined, r("The0002")) },
    ], false),
    "The0002": o([
        { json: "canon", js: "canon", typ: true },
        { json: "modreward", js: "modreward", typ: true },
        { json: "name", js: "name", typ: r("Name") },
        { json: "portrait_bounty", js: "portrait_bounty", typ: m(0) },
        { json: "portrait_complete", js: "portrait_complete", typ: 0 },
        { json: "portrait_credit", js: "portrait_credit", typ: r("Credit") },
        { json: "portrait_files", js: "portrait_files", typ: m(true) },
        { json: "portrait_link", js: "portrait_link", typ: "" },
        { json: "portrait_modified", js: "portrait_modified", typ: "" },
        { json: "portrait_pending", js: "portrait_pending", typ: r("PortraitPending") },
        { json: "portrait_recolor_link", js: "portrait_recolor_link", typ: "" },
        { json: "portrait_required", js: "portrait_required", typ: true },
        { json: "sprite_bounty", js: "sprite_bounty", typ: r("PortraitPending") },
        { json: "sprite_complete", js: "sprite_complete", typ: 0 },
        { json: "sprite_credit", js: "sprite_credit", typ: r("Credit") },
        { json: "sprite_files", js: "sprite_files", typ: m(true) },
        { json: "sprite_link", js: "sprite_link", typ: "" },
        { json: "sprite_modified", js: "sprite_modified", typ: "" },
        { json: "sprite_pending", js: "sprite_pending", typ: r("PortraitPending") },
        { json: "sprite_recolor_link", js: "sprite_recolor_link", typ: "" },
        { json: "sprite_required", js: "sprite_required", typ: true },
        { json: "subgroups", js: "subgroups", typ: r("PortraitPending") },
    ], false),
    "Name": [
        "",
        "Female",
        "Shiny",
    ],
};
