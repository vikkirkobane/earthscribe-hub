import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

// Initialize TensorFlow backend
export const initializeTensorFlow = async () => {
  try {
    // Initialize WebGL backend
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('TensorFlow.js backend:', tf.getBackend());
  } catch (error) {
    console.error('Error initializing TensorFlow.js:', error);
    // Fallback to CPU backend if WebGL fails
    try {
      await tf.setBackend('cpu');
      await tf.ready();
      console.log('Using CPU backend for TensorFlow.js');
    } catch (cpuError) {
      console.error('Error initializing CPU backend:', cpuError);
    }
  }
};

// Types for validation results
export type ValidationResult = {
  class: string;
  confidence: number;
  validated: boolean;
  topClasses: { className: string; probability: number }[];
};

// Quest validation configuration
const QUEST_VALIDATION_THRESHOLDS = {
  soil_erosion: 0.7,
  crop_health: 0.7,
  water_monitoring: 0.6,
  vegetation_health: 0.7,
  degraded_land: 0.65
};

// Class labels for the model (example - would match your model's output)
const CLASS_LABELS = [
  'healthy_soil',
  'eroded_soil', 
  'healthy_crop',
  'diseased_crop',
  'water_body',
  'dry_water_source',
  'healthy_vegetation',
  'degraded_land'
];

// Load the TensorFlow model
export const loadModel = async (modelPath: string = '/models/model.json') => {
  try {
    const model = await tf.loadLayersModel(modelPath);
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    // In a real app, you might want to load a fallback model or handle this differently
    return null;
  }
};

// Preprocess image for model input
export const preprocessImage = (imageData: tf.Tensor3D | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): tf.Tensor4D => {
  // Resize image to model's expected input size (e.g., 224x224)
  const resized = tf.image.resizeBilinear(imageData, [224, 224]);
  
  // Normalize pixel values to [0, 1] range
  const normalized = tf.div(resized, 255.0);
  
  // Add batch dimension
  const batched = tf.expandDims(normalized, 0) as tf.Tensor4D;
  
  return batched;
};

// Validate a quest image using the loaded model
export const validateQuestImage = async (
  imageData: tf.Tensor3D | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  questType: 'soil_erosion' | 'crop_health' | 'water_monitoring' | 'vegetation_health' | 'degraded_land',
  model: tf.LayersModel | null
): Promise<ValidationResult> => {
  if (!model) {
    console.error('Model not loaded');
    return {
      class: 'unknown',
      confidence: 0,
      validated: false,
      topClasses: []
    };
  }

  try {
    // Preprocess the input image
    const processedImage = preprocessImage(imageData);
    
    // Make prediction
    const predictions = model.predict(processedImage) as tf.Tensor;
    const probabilities = await predictions.data();
    
    // Get top classes with their probabilities
    const topClasses = Array.from(probabilities)
      .map((prob, index) => ({
        className: CLASS_LABELS[index] || `class_${index}`,
        probability: prob
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5); // Top 5 predictions
    
    // Get the top prediction
    const topPrediction = topClasses[0];
    
    // Determine if validation passes based on quest type and confidence threshold
    const threshold = QUEST_VALIDATION_THRESHOLDS[questType];
    const validated = topPrediction.probability >= threshold;
    
    // For specific quest types, we might need to check if the predicted class matches expected types
    let classMatches = true;
    
    // Example validation logic for different quest types:
    switch (questType) {
      case 'soil_erosion':
        // For erosion detection, look for 'eroded_soil' or similar class
        classMatches = topPrediction.className.includes('eroded') || topPrediction.className.includes('erosion');
        break;
      case 'crop_health':
        // For crop health, could look for 'diseased_crop' or 'healthy_crop'
        classMatches = topPrediction.className.includes('crop');
        break;
      case 'water_monitoring':
        // For water monitoring, look for water-related classes
        classMatches = topPrediction.className.includes('water');
        break;
      case 'vegetation_health':
        // For vegetation, look for vegetation-related classes
        classMatches = topPrediction.className.includes('vegetation') || topPrediction.className.includes('plant');
        break;
      case 'degraded_land':
        // For degraded land, look for 'degraded' or similar
        classMatches = topPrediction.className.includes('degraded') || topPrediction.className.includes('bare');
        break;
    }
    
    // Validation passes if both confidence is high enough AND the class is relevant
    const finalValidation = validated && classMatches;
    
    return {
      class: topPrediction.className,
      confidence: topPrediction.probability,
      validated: finalValidation,
      topClasses
    };
  } catch (error) {
    console.error('Error during image validation:', error);
    return {
      class: 'error',
      confidence: 0,
      validated: false,
      topClasses: []
    };
  } finally {
    // Clean up tensors to prevent memory leaks
    tf.dispose();
  }
};

// Get top class prediction
export const getTopClass = (probabilities: Float32Array | number[]): { className: string; probability: number } => {
  const maxIndex = probabilities.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
  return {
    className: CLASS_LABELS[maxIndex] || `class_${maxIndex}`,
    probability: Array.isArray(probabilities) ? probabilities[maxIndex] : probabilities[maxIndex]
  };
};

// Validate image with default model (will try to load from standard location)
export const validateWithDefaultModel = async (
  imageData: tf.Tensor3D | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  questType: 'soil_erosion' | 'crop_health' | 'water_monitoring' | 'vegetation_health' | 'degraded_land'
) => {
  // Note: In production, you would have your trained model at this location
  // For now, we'll return a mock result to demonstrate the functionality
  console.log(`Validating ${questType} quest with image`);
  
  // Mock validation results for demonstration
  const mockResults: Record<string, ValidationResult> = {
    soil_erosion: {
      class: 'eroded_soil',
      confidence: 0.85,
      validated: true,
      topClasses: [
        { className: 'eroded_soil', probability: 0.85 },
        { className: 'dry_soil', probability: 0.10 },
        { className: 'healthy_soil', probability: 0.03 },
        { className: 'rock', probability: 0.02 }
      ]
    },
    crop_health: {
      class: 'diseased_crop',
      confidence: 0.78,
      validated: true,
      topClasses: [
        { className: 'diseased_crop', probability: 0.78 },
        { className: 'healthy_crop', probability: 0.15 },
        { className: 'pest_damage', probability: 0.05 },
        { className: 'nutrient_deficiency', probability: 0.02 }
      ]
    },
    water_monitoring: {
      class: 'water_body',
      confidence: 0.92,
      validated: true,
      topClasses: [
        { className: 'water_body', probability: 0.92 },
        { className: 'dry_water_source', probability: 0.05 },
        { className: 'water_plant', probability: 0.02 },
        { className: 'muddy_water', probability: 0.01 }
      ]
    },
    vegetation_health: {
      class: 'healthy_vegetation',
      confidence: 0.88,
      validated: true,
      topClasses: [
        { className: 'healthy_vegetation', probability: 0.88 },
        { className: 'dry_vegetation', probability: 0.08 },
        { className: 'young_plant', probability: 0.03 },
        { className: 'flowering_plant', probability: 0.01 }
      ]
    },
    degraded_land: {
      class: 'degraded_land',
      confidence: 0.75,
      validated: true,
      topClasses: [
        { className: 'degraded_land', probability: 0.75 },
        { className: 'bare_soil', probability: 0.15 },
        { className: 'erosion_sign', probability: 0.07 },
        { className: 'polluted_area', probability: 0.03 }
      ]
    }
  };
  
  // In a real implementation, we would load the model and run actual validation
  // For now, return mock results based on quest type
  return mockResults[questType] || {
    class: 'unknown',
    confidence: 0,
    validated: false,
    topClasses: []
  };
};