export interface ITracker {
    name:                  string;
    portrait_credit:       Credit;
    portrait_files:        { [key: string]: boolean };
    sprite_credit:         Credit;
    sprite_files:          { [key: string]: boolean };
    subgroups:             { [key: string]: ITracker };
}

export interface Credit {
    primary:   string;
    secondary: string[];
    total:     number;
}

export enum Name {
    Empty = '',
    Female = 'Female',
    Shiny = 'Shiny',
}