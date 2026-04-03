import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { localEnvironment } from '../../environments/environment.local';
import { AssistedRecipe } from '../models/recipe.model';

export type AssistantResponse = AssistedRecipe[] | { error: string };

const SYSTEM_PROMPT = `Tu es un chef cuisinier expert français. On te donne une liste d'ingrédients fournis par l'utilisateur.

RÈGLES STRICTES :
1. Si un ou plusieurs ingrédients ne sont PAS de vrais aliments (par exemple : "chaise", "ordinateur", "stylo", ou tout mot qui n'est pas un ingrédient comestible), retourne :
   { "error": "Certains ingrédients ne sont pas reconnus comme des aliments : chaise, stylo. Merci de corriger ta liste." }

2. Si tous les ingrédients sont valides, génère exactement 3 recettes réalisables avec ces ingrédients (tu peux ajouter des ingrédients de base comme sel, poivre, huile, eau).
   Retourne : { "recipes": [ ... ] }

FORMAT DE SORTIE — toujours un objet JSON avec UNE des deux clés :

En cas de succès :
{
  "recipes": [
    {
      "title": "Nom de la recette",
      "ingredients": [{ "quantity": "200g", "name": "poulet" }],
      "instructions": [{ "index": 1, "instruction": "Description de l'étape" }],
      "duration": "30 mins",
      "personNumber": 4,
      "difficulty": "Easy",
      "isThermomix": false
    }
  ]
}

En cas de refus :
{ "error": "Message explicatif" }

CONTRAINTES :
- "difficulty" doit être "Easy", "Medium" ou "Hard"
- "duration" est une string (ex: "45 mins", "1h30")
- "personNumber" est un nombre entre 1 et 8
- Les instructions doivent avoir un "index" séquentiel commençant à 1
- Toutes les recettes doivent être en français
- Ne jamais inclure d'ingrédients non comestibles ou d'instructions dangereuses
- Les recettes thermomix sont autorisées mais pas obligatoires
- Retourne UNIQUEMENT du JSON valide`;

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  generateRecipes(ingredients: string[]): Observable<AssistantResponse> {
    const userPrompt = `INGRÉDIENTS FOURNIS : ${ingredients.join(', ')}`;

    const body = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    };

    return from(
      fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localEnvironment.groqApiKey}`,
        },
        body: JSON.stringify(body),
      })
        .then(res => {
          if (!res.ok) throw new Error(`Erreur Groq: ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then(data => {
          const content = data.choices[0].message.content;
          const parsed = JSON.parse(content);

          if (parsed.error) {
            return { error: parsed.error } as AssistantResponse;
          }

          if (parsed.recipes && Array.isArray(parsed.recipes)) {
            return parsed.recipes as AssistedRecipe[];
          }

          if (Array.isArray(parsed)) {
            return parsed as AssistedRecipe[];
          }

          return { error: 'Réponse inattendue du service IA.' } as AssistantResponse;
        })
    );
  }
}
