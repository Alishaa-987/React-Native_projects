import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";


export default function Details() {
    const params = useLocalSearchParams();
    const [pokemon, setPokemon] = useState<any>(null);
    console.log(params);

    useEffect(()=>{
        if (params.name) {
            fetchPokemonByName(params.name as string);
        }
    },[params.name])
    async function fetchPokemonByName(name: string){
        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();
            setPokemon(data);
        }catch(e){
            console.log(e)
        }
    }
  return (
    <>
    <Stack.Screen options={{title:params.name as string}}/>
    <ScrollView
    contentContainerStyle={{
      gap:16,
      padding:16,
    }}
    >
    {pokemon && (
        <View style={{alignItems: 'center'}}>
            <Text style={styles.name}>{pokemon.name}</Text>
            <Image source={{uri: pokemon.sprites.front_default}} style={{width: 200, height: 200}} />
            <Text style={styles.Text}>Height: {pokemon.height}</Text>
            <Text style={styles.Text}>Weight: {pokemon.weight}</Text>
            <Text style={styles.Text}>Types: {pokemon.types.map((t: any) => t.type.name).join(', ')}</Text>
            <Text style={styles.Text}>Abilities: {pokemon.abilities.map((a: any) => a.ability.name).join(', ')}</Text>
        </View>
    )}
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
         name: {
          fontWeight: 'bold',
          fontSize: 28,
          textAlign: 'center',
          textTransform: 'capitalize',

         },
         Text: {
          textAlign: 'center',
          fontFamily: 'Georgia',
          fontSize: 20,
          marginVertical: 4,

         }
})
