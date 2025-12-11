
// Configuration IPFS avec Pinata
export interface RouteData {
  userAddress: string;
  locations: Array<{
    lat: number;
    lng: number;
    timestamp: number;
    accuracy?: number;
  }>;
  distance: number;
  duration: number;
  startTime: string;
  endTime: string;
}

export async function uploadRouteData(routeData: RouteData): Promise<{
  success: boolean;
  ipfsHash?: string;
  error?: string;
  metadata?: any;
  tokenURI?: string;
}> {
  try {
    // Créer les métadonnées JSON
    const routeMetadata = {
      name: `FixieRun Route - ${new Date().toLocaleDateString()}`,
      description: `Course GPS enregistrée avec FixieRun - Distance: ${(routeData.distance / 1000).toFixed(2)}km`,
      image: null, // Sera ajoutée plus tard
      external_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/route/${routeData.userAddress}`,
      attributes: [
        {
          trait_type: "Distance",
          value: `${routeData.distance.toFixed(2)}m`
        },
        {
          trait_type: "Duration", 
          value: `${Math.floor(routeData.duration / 60)}min`
        },
        {
          trait_type: "Start Time",
          value: routeData.startTime
        },
        {
          trait_type: "End Time", 
          value: routeData.endTime
        },
        {
          trait_type: "Points",
          value: routeData.locations.length
        }
      ],
      route_data: routeData.locations
    }

    // Simulation d'upload IPFS pour la démo
    const ipfsHash = Math.random().toString(36).substring(2, 15)
    
    return {
      success: true,
      ipfsHash,
      tokenURI: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      metadata: routeMetadata
    }
  } catch (error) {
    console.error('Erreur upload IPFS:', error)
    return {
      success: false,
      error: 'Erreur lors de l\'upload vers IPFS'
    }
  }
}

export async function uploadImageToIPFS(imageFile: Buffer, filename: string) {
  try {
    // Simulation d'upload d'image pour la démo
    const ipfsHash = Math.random().toString(36).substring(2, 15)
    return {
      success: true,
      ipfsHash,
      imageURL: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
    }
  } catch (error) {
    console.error('Erreur upload image IPFS:', error)
    return {
      success: false,
      error: 'Erreur lors de l\'upload de l\'image'
    }
  }
}