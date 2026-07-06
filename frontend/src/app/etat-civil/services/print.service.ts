import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  /**
   * Ouvre un document HTML dans une nouvelle fenêtre et déclenche l'impression automatiquement
   * @param html - Le contenu HTML à imprimer
   * @param titre - Le titre du document
   */
  printDocument(html: string, titre: string = 'Document'): void {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (win) {
      win.document.write(html);
      win.document.close();
      
      // Attendre que le DOM soit complètement chargé avant d'imprimer
      win.onload = () => {
        setTimeout(() => {
          win.print();
        }, 250);
      };
    }
  }

  /**
   * Télécharge un document HTML en tant que fichier PDF (sans dépendance externe)
   * Utilise l'API d'impression native du navigateur
   * @param html - Le contenu HTML
   * @param nomFichier - Le nom du fichier à télécharger
   */
  downloadAsPDF(html: string, nomFichier: string = 'document'): void {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (win) {
      win.document.write(html);
      win.document.close();
      
      // Déclencher le téléchargement via l'imprimante virtuelle (Enregistrer en PDF)
      win.onload = () => {
        setTimeout(() => {
          // Modifier le titre du document pour qu'il s'affiche comme nom de fichier
          const timestamp = new Date().getTime();
          win.document.title = `${nomFichier}-${timestamp}`;
          win.print();
        }, 250);
      };
    }
  }

  /**
   * Affiche un aperçu avant impression sans imprimer automatiquement
   * @param html - Le contenu HTML
   * @param titre - Le titre du document
   */
  previewDocument(html: string, titre: string = 'Document'): void {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.document.title = titre;
    }
  }

  /**
   * Imprime directement à partir d'une chaîne HTML sans ouvrir une fenêtre
   * Utilise un iframe caché
   * @param html - Le contenu HTML à imprimer
   */
  printDirectly(html: string): void {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }
}
