import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Pkm } from "../../../../../types/enum/Pokemon";
import { localStore, LocalStoreKeys } from "../../utils/store";
import { Synergy } from "../../../../../types/enum/Synergy";
import { Checkbox } from "../checkbox/checkbox";
import SynergyIcon from "../icons/synergy-icon";
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead";
import PokemonCarousel from "./pokemon-carousel";
import PokemonEmotionsModal from "./pokemon-emotions-modal";
import UnownPanel from "./unown-panel";
import "./pokemon-collection.css";

export default function PokemonCollection() {
  const { t } = useTranslation();
  const [selectedPokemon, setSelectedPokemon] = useState<Pkm | undefined>(
    undefined
  );

  const prevFilterState = useMemo(() => {
    const prevState = localStore.get(LocalStoreKeys.COLLECTION_FILTER);
    return {
      filter: prevState?.filter ?? "unlockable",
      sort: prevState?.sort ?? "index",
      shinyOnly: prevState?.shinyOnly ?? false,
    };
  }, [localStore]);

  const [filter, setFilter] = useState<string>(prevFilterState.filter);
  const [sort, setSort] = useState<string>(prevFilterState.sort);
  const [shinyOnly, setShinyOnly] = useState<boolean>(
    prevFilterState.shinyOnly
  );

  useEffect(() => {
    localStore.set(LocalStoreKeys.COLLECTION_FILTER, {
      filter,
      sort,
      shinyOnly,
    });
  }, [filter, sort, shinyOnly]);

  return (
    <div id='pokemon-collection'>
      <header className='my-container'>
        <PokemonTypeahead
          value={selectedPokemon ?? ""}
          onChange={setSelectedPokemon}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value={"all"}>{t("show_all")}</option>
          <option value={"locked"}>{t("show_locked")}</option>
          <option value={"unlockable"}>{t("show_unlockable")}</option>
          <option value={"unlocked"}>{t("show_unlocked")}</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value={"index"}>{t("sort_by_index")}</option>
          <option value={"shards"}>{t("sort_by_shards")}</option>
        </select>

        <Checkbox
          checked={shinyOnly}
          onToggle={setShinyOnly}
          label={t("shiny_hunter")}
          isDark
        />
      </header>
      <div className='my-container'>
        <Tabs>
          <TabList className='pokemon-collection-tabs'>
            <Tab key='title-all'>{t("ALL")}</Tab>
            {(Object.keys(Synergy) as Synergy[]).map((type) => {
              return (
                <Tab key={"title-" + type}>
                  <SynergyIcon type={type} />
                </Tab>
              );
            })}
            <Tab key='?'>
              <img
                src='assets/unown/unown-qm.png'
                alt='?'
                className='unown-icon'
              />
            </Tab>
          </TabList>

          {(["all"].concat(Object.keys(Synergy)) as (Synergy | "all")[]).map(
            (type) => {
              return (
                <TabPanel key={type}>
                  <PokemonCarousel
                    type={type}
                    setPokemon={setSelectedPokemon}
                    filter={filter}
                    sort={sort}
                    shinyOnly={shinyOnly}
                  />
                </TabPanel>
              );
            }
          )}
          <TabPanel>
            <UnownPanel
              setPokemon={setSelectedPokemon}
              filter={filter}
              sort={sort}
              shinyOnly={shinyOnly}
            />
          </TabPanel>
        </Tabs>
      </div>
      {selectedPokemon && (
        <PokemonEmotionsModal
          pokemon={selectedPokemon}
          onHide={() => setSelectedPokemon(undefined)}
        />
      )}
    </div>
  );
}
