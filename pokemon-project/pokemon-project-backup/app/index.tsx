import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";

interface pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: pokemonType[];
}

interface pokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorByType: Record<string, string> = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  bug: "#15a93083",
  normal: "#a1a126ff",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export default function Index() {
  const [pokemon, setPokemon] = useState<pokemon[]>([]);

  console.log(JSON.stringify(pokemon[0], null, 2));
  console.log(pokemon);
  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=20"
      );
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );
      setPokemon(detailedPokemons);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      {pokemon.map((pokemon) => (
        <Link key={pokemon.name}
        href={{pathname:'/details' , params: {name: pokemon.name}}}  
        style={{
              backgroundColor: colorByType[pokemon.types[0].type.name],
              padding: 50,
              borderRadius: 20,
            }}>
          <View
           
          >
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.types}>{pokemon.types[0].type.name}</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={{ uri: pokemon.image }}
                style={{ width: 150, height: 150 }}
              />

              <Image
                source={{ uri: pokemon.imageBack }}
                style={{ width: 150, height: 150 }}
              />
            </View>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },

  types: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
    textTransform: "capitalize",
  },
});
