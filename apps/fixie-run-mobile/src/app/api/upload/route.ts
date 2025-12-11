import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadRouteData, type RouteData } from '@/lib/ipfs'
import { createPublicClient, http, formatEther } from 'viem'
import { sepolia } from 'viem/chains'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const routeData: RouteData = body.routeData

    if (!routeData.userAddress || !routeData.locations || routeData.locations.length < 2) {
      return NextResponse.json(
        { error: 'Données de route invalides' },
        { status: 400 }
      )
    }

    // Upload vers IPFS
    const ipfsResult = await uploadRouteData(routeData)
    if (!ipfsResult.success) {
      return NextResponse.json(
        { error: ipfsResult.error },
        { status: 500 }
      )
    }

    // Sauvegarder en base de données
    const route = await prisma.route.create({
      data: {
        userAddress: routeData.userAddress,
        routeData: routeData.locations,
        ipfsHash: ipfsResult.ipfsHash,
        distance: routeData.distance,
        duration: routeData.duration,
        startTime: new Date(routeData.startTime),
        endTime: new Date(routeData.endTime),
        metadata: ipfsResult.metadata
      }
    })

    return NextResponse.json({
      success: true,
      routeId: route.id,
      ipfsHash: ipfsResult.ipfsHash,
      tokenURI: ipfsResult.tokenURI
    })

  } catch (error) {
    console.error('Erreur API upload:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}