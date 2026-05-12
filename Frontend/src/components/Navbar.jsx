import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../api/axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap');

  .nav-root {
    position: sticky;
    top: 0;
    z-index: 1000;
    font-family: 'Sora', sans-serif;
  }

  .nav-bar {
    background: linear-gradient(
      135deg,
      rgba(7, 5, 28, 0.88) 0%,
      rgba(10, 7, 35, 0.85) 40%,
      rgba(14, 8, 40, 0.88) 100%
    );
    backdrop-filter: blur(32px) saturate(200%) brightness(1.08);
    -webkit-backdrop-filter: blur(32px) saturate(200%) brightness(1.08);
    border-bottom: 1px solid rgba(139, 92, 246, 0.18);
    box-shadow:
      0 1px 0 rgba(255,255,255,0.04) inset,
      0 8px 48px rgba(0,0,0,0.5),
      0 2px 16px rgba(99,102,241,0.08);
    padding: 0 36px;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    position: relative;
  }

  .nav-bar::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(139,92,246,0.6) 20%,
      rgba(99,102,241,0.9) 50%,
      rgba(139,92,246,0.6) 80%,
      transparent 100%
    );
    pointer-events: none;
  }

  .nav-bar::after {
    content: '';
    position: absolute;
    top: -40px; left: 50%; transform: translateX(-50%);
    width: 60%;
    height: 80px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .nav-logo-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(99,102,241,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset;
  }

  .nav-logo-text {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 19px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.04em;
  }

  .nav-logo-text span { color: #818cf8; }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
  }

  .nav-link {
    padding: 8px 16px;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .nav-link:hover {
    color: rgba(255,255,255,0.88);
    background: rgba(255,255,255,0.07);
  }

  .nav-link.active {
    color: #c4b5fd;
    background: rgba(99,102,241,0.15);
    box-shadow: inset 0 0 0 1px rgba(139,92,246,0.25), 0 2px 12px rgba(99,102,241,0.1);
  }

  .nav-link-icon {
    width: 16px; height: 16px;
    opacity: 0.65;
    flex-shrink: 0;
  }

  .nav-sep-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    flex-shrink: 0;
    margin: 0 4px;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .nav-cart {
    position: relative;
    width: 40px; height: 40px;
    border-radius: 11px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .nav-cart:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-color: rgba(255,255,255,0.16);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  .nav-cart-badge {
    position: absolute;
    top: -5px; right: -5px;
    min-width: 18px; height: 18px;
    border-radius: 999px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    padding: 0 4px;
    border: 2px solid #07051c;
    box-shadow: 0 2px 6px rgba(99,102,241,0.4);
  }

  .nav-btn-ghost {
    padding: 8px 18px;
    border-radius: 9px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.13);
    color: rgba(255,255,255,0.65);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: flex; align-items: center;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .nav-btn-ghost:hover {
    border-color: rgba(255,255,255,0.28);
    color: #fff;
    background: rgba(255,255,255,0.06);
  }

  .nav-btn-primary {
    padding: 8px 20px;
    border-radius: 9px;
    background: linear-gradient(135deg, #6366f1 0%, #5b5be8 50%, #4f46e5 100%);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: flex; align-items: center;
    transition: all 0.25s ease;
    box-shadow: 0 4px 16px rgba(99,102,241,0.4), 0 1px 0 rgba(255,255,255,0.12) inset;
    white-space: nowrap;
  }

  .nav-btn-primary:hover {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.5);
  }

  .nav-avatar-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px 5px 5px;
    border-radius: 11px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .nav-avatar-btn:hover {
    background: rgba(255,255,255,0.09);
    border-color: rgba(139,92,246,0.25);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  .nav-avatar {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(99,102,241,0.35);
  }

  .nav-avatar-name {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nav-avatar-chevron {
    color: rgba(255,255,255,0.3);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .nav-avatar-chevron.open { transform: rotate(180deg); }

  .nav-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 220px;
    background: linear-gradient(160deg, rgba(12,10,38,0.98) 0%, rgba(8,7,28,0.98) 100%);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 16px;
    box-shadow:
      0 24px 60px rgba(0,0,0,0.6),
      0 0 0 1px rgba(255,255,255,0.03) inset,
      0 1px 0 rgba(255,255,255,0.06) inset;
    overflow: hidden;
    z-index: 100;
    animation: nav-drop-in 0.18s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes nav-drop-in {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .nav-dropdown-header {
    padding: 14px 16px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
  }

  .nav-dropdown-name {
    font-size: 13.5px;
    font-weight: 600;
    color: #f1f5f9;
  }

  .nav-dropdown-role {
    font-size: 11px;
    color: rgba(139,92,246,0.7);
    margin-top: 2px;
    text-transform: capitalize;
    font-weight: 500;
  }

  .nav-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 400;
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    font-family: 'Sora', sans-serif;
    transition: all 0.18s ease;
  }

  .nav-dropdown-item:hover {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.9);
  }

  .nav-dropdown-item.danger { color: rgba(248,113,113,0.7); }
  .nav-dropdown-item.danger:hover {
    background: rgba(239,68,68,0.08);
    color: #f87171;
  }

  .nav-dropdown-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 4px 0;
  }

  .nav-dropdown-icon {
    width: 16px; height: 16px;
    opacity: 0.6;
    flex-shrink: 0;
  }

  .nav-mobile-toggle {
    display: none;
    width: 40px; height: 40px;
    border-radius: 11px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    align-items: center; justify-content: center;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
  }

  .nav-mobile-toggle:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-mobile-toggle { display: flex; }
    .nav-bar { padding: 0 20px; }
    .nav-btn-ghost { display: none; }
  }

  .nav-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 1100;
    animation: nav-fade-in 0.2s ease;
  }

  @keyframes nav-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .nav-drawer {
    position: fixed;
    top: 0; left: 0;
    width: 285px; height: 100vh;
    background: linear-gradient(160deg, rgba(9,7,30,0.99) 0%, rgba(6,5,22,0.99) 100%);
    backdrop-filter: blur(24px);
    border-right: 1px solid rgba(139,92,246,0.14);
    box-shadow: 4px 0 40px rgba(0,0,0,0.5);
    z-index: 1200;
    display: flex;
    flex-direction: column;
    animation: nav-slide-in 0.28s cubic-bezier(0.22,1,0.36,1);
    overflow-y: auto;
  }

  @keyframes nav-slide-in {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  .nav-drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .nav-drawer-close {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.6);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
  }

  .nav-drawer-close:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }

  .nav-drawer-user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(99,102,241,0.04);
  }

  .nav-drawer-avatar {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(99,102,241,0.4);
  }

  .nav-drawer-uname {
    font-size: 14px; font-weight: 600;
    color: #f1f5f9;
  }

  .nav-drawer-urole {
    font-size: 11px;
    color: rgba(139,92,246,0.7);
    text-transform: capitalize;
    margin-top: 2px;
    font-weight: 500;
  }

  .nav-drawer-links {
    padding: 14px 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .nav-drawer-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border-radius: 11px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .nav-drawer-link:hover {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.9);
  }

  .nav-drawer-link.active {
    background: rgba(99,102,241,0.14);
    color: #c4b5fd;
    box-shadow: inset 0 0 0 1px rgba(139,92,246,0.22);
  }

  .nav-drawer-link.danger { color: rgba(248,113,113,0.7); }
  .nav-drawer-link.danger:hover {
    background: rgba(239,68,68,0.08);
    color: #f87171;
  }

  .nav-drawer-sep {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 8px 4px;
  }

  .nav-drawer-auth {
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .nav-drawer-auth-btn {
    width: 100%;
    padding: 12px;
    border-radius: 11px;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    display: block;
    transition: all 0.2s ease;
  }

  .nav-drawer-auth-btn.outline {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.13);
    color: rgba(255,255,255,0.65);
  }

  .nav-drawer-auth-btn.outline:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
  }

  .nav-drawer-auth-btn.filled {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    box-shadow: 0 4px 16px rgba(99,102,241,0.35);
  }

  .nav-drawer-auth-btn.filled:hover {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    box-shadow: 0 6px 22px rgba(99,102,241,0.5);
  }

  /* ── MODAL OVERLAY ── */
  .nm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(10px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: nav-fade-in 0.2s ease;
  }

  .nm-modal {
    width: 100%;
    max-width: 480px;
    background: linear-gradient(160deg, rgba(12,10,38,0.99) 0%, rgba(8,7,28,0.99) 100%);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 22px;
    box-shadow:
      0 32px 80px rgba(0,0,0,0.7),
      0 0 0 1px rgba(255,255,255,0.04) inset;
    overflow: hidden;
    animation: nm-pop-in 0.22s cubic-bezier(0.22,1,0.36,1);
    font-family: 'Sora', sans-serif;
  }

  @keyframes nm-pop-in {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .nm-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 22px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
  }

  .nm-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
  }

  .nm-close {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: all 0.18s;
  }

  .nm-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

  .nm-body { padding: 22px; }

  /* Avatar row in profile modal */
  .nm-avatar-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 22px;
    padding: 16px;
    background: rgba(99,102,241,0.06);
    border: 1px solid rgba(139,92,246,0.14);
    border-radius: 14px;
  }

  .nm-avatar-big {
    width: 54px; height: 54px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(99,102,241,0.4);
  }

  .nm-avatar-info-name {
    font-size: 16px; font-weight: 600;
    color: #f1f5f9;
  }

  .nm-avatar-info-role {
    font-size: 12px;
    color: rgba(139,92,246,0.8);
    text-transform: capitalize;
    margin-top: 3px;
  }

  /* Field rows */
  .nm-field {
    margin-bottom: 14px;
  }

  .nm-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(139,92,246,0.7);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 6px;
  }

  .nm-value {
    font-size: 14px;
    color: rgba(255,255,255,0.82);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 10px 14px;
    word-break: break-all;
  }

  .nm-value.muted { color: rgba(255,255,255,0.3); font-style: italic; }

  /* Address cards */
  .nm-addr-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 13px;
    padding: 14px 16px;
    margin-bottom: 10px;
  }

  .nm-addr-card:last-child { margin-bottom: 0; }

  .nm-addr-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .nm-addr-tag {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #818cf8;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.2);
    padding: 2px 8px;
    border-radius: 6px;
  }

  .nm-addr-default {
    font-size: 10px;
    color: rgba(34,197,94,0.8);
    font-weight: 600;
  }

  .nm-addr-name {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    margin-bottom: 4px;
  }

  .nm-addr-text {
    font-size: 13.5px;
    color: rgba(255,255,255,0.7);
    line-height: 1.55;
  }

  .nm-addr-phone {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    margin-top: 6px;
  }

  .nm-loading {
    text-align: center;
    padding: 32px;
    color: rgba(255,255,255,0.3);
    font-size: 13px;
  }

  .nm-empty {
    text-align: center;
    padding: 28px 16px;
    color: rgba(255,255,255,0.3);
    font-size: 13px;
  }

  .nm-spinner {
    width: 22px; height: 22px;
    border: 2px solid rgba(99,102,241,0.25);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: nm-spin 0.7s linear infinite;
    margin: 0 auto 10px;
  }

  @keyframes nm-spin { to { transform: rotate(360deg); } }
`;

// ── Icons ──────────────────────────────────────────────
const IconHome = () => (
  <svg className="nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
    <polyline points="9 21 9 12 15 12 15 21"/>
  </svg>
);
const IconBooks = () => (
  <svg className="nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const IconDashboard = () => (
  <svg className="nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconInventory = () => (
  <svg className="nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);
const IconOrders = () => (
  <svg className="nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const IconCart = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconLogout = () => (
  <svg className="nav-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconProfile = () => (
  <svg className="nav-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconAddress = () => (
  <svg className="nav-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconChevron = ({ className }) => (
  <svg className={`nav-avatar-chevron ${className || ""}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconClose = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Profile Modal ──────────────────────────────────────
function ProfileModal({ user, onClose }) {
  return (
    <div className="nm-overlay" onClick={onClose}>
      <div className="nm-modal" onClick={e => e.stopPropagation()}>
        <div className="nm-head">
          <span className="nm-title">My Profile</span>
          <button className="nm-close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="nm-body">
          <div className="nm-avatar-row">
            <div className="nm-avatar-big">{user.fullname?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="nm-avatar-info-name">{user.fullname}</div>
              <div className="nm-avatar-info-role">{user.role}</div>
            </div>
          </div>

          <div className="nm-field">
            <div className="nm-label">Full Name</div>
            <div className="nm-value">{user.fullname || '—'}</div>
          </div>

          <div className="nm-field">
            <div className="nm-label">Email</div>
            <div className="nm-value">{user.email || '—'}</div>
          </div>

          <div className="nm-field">
            <div className="nm-label">Phone</div>
            <div className={`nm-value ${!user.phone ? 'muted' : ''}`}>
              {user.phone || 'Not added'}
            </div>
          </div>

          <div className="nm-field">
            <div className="nm-label">Role</div>
            <div className="nm-value" style={{ textTransform: 'capitalize' }}>{user.role}</div>
          </div>

          <div className="nm-field">
            <div className="nm-label">Member Since</div>
            <div className="nm-value">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Saved Addresses Modal ──────────────────────────────
function AddressModal({ onClose }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // ✅ FIX 1: correct route — mounted at /api/users/me/addresses → GET /
        const { data } = await API.get(`/users/me/addresses`);
        // ✅ FIX 2: controller returns { address: [...] } not { addresses: [...] }
        setAddresses(data.address || []);
      } catch {
        toast.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <div className="nm-overlay" onClick={onClose}>
      <div className="nm-modal" onClick={e => e.stopPropagation()}>
        <div className="nm-head">
          <span className="nm-title">Saved Addresses</span>
          <button className="nm-close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="nm-body">
          {loading ? (
            <div className="nm-loading">
              <div className="nm-spinner" />
              Loading addresses…
            </div>
          ) : addresses.length === 0 ? (
            <div className="nm-empty">No saved addresses yet.</div>
          ) : (
            addresses.map((addr, i) => (
              <div key={addr._id || i} className="nm-addr-card">
                <div className="nm-addr-top">
                  {/* ✅ FIX 3: schema has no label/type field — use index as fallback */}
                  <span className="nm-addr-tag">Address {i + 1}</span>
                  {addr.isDefault && <span className="nm-addr-default">✓ Default</span>}
                </div>

                {/* ✅ FIX 4: schema fields are name, street, city, state, pincode, country */}
                {addr.name && <div className="nm-addr-name">{addr.name}</div>}
                <div className="nm-addr-text">
                  {[addr.street, addr.city, addr.state, addr.pincode, addr.country]
                    .filter(Boolean)
                    .join(', ')}
                </div>

                {/* ✅ FIX 5: phone is on the address subdoc, not top-level */}
                {addr.phone && <div className="nm-addr-phone">📞 {addr.phone}</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Navbar ────────────────────────────────────────
export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart }         = useCart();
  const navigate         = useNavigate();
  const location         = useLocation();

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeModal,  setActiveModal]  = useState(null); // 'profile' | 'address' | null
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Hide navbar on auth pages
  if (location.pathname === "/login" || location.pathname === "/register") return null;

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      setDrawerOpen(false);
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.info("Please login to view your cart");
      navigate("/login");
    }
  };

  const openModal = (type) => {
    setDropdownOpen(false);
    setDrawerOpen(false);
    setActiveModal(type);
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  const isSeller = user?.role === "seller";

  const sellerLinks = [
    { label: "Dashboard", path: "/seller/dashboard", icon: <IconDashboard /> },
    { label: "My Books",  path: "/seller/books",     icon: <IconInventory /> },
    { label: "Orders",    path: "/seller/orders",    icon: <IconOrders /> },
  ];
  const buyerLinks = [
    { label: "My Orders", path: "/my-orders", icon: <IconOrders /> },
  ];
  const navLinks = isSeller ? sellerLinks : buyerLinks;

  return (
    <>
      <style>{styles}</style>
      <div className="nav-root">
        <nav className="nav-bar">

          {/* Logo */}
          <Link to={user ? (isSeller ? "/seller/dashboard" : "/books") : "/"} className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span className="nav-logo-text">Book<span>Store</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links">
            {!isSeller && (
              <>
                <Link to="/" className={`nav-link ${isActive("/")}`}>
                  <IconHome /> Home
                </Link>
                <Link to="/books" className={`nav-link ${isActive("/books")}`}>
                  <IconBooks /> Books
                </Link>
              </>
            )}

            {user && <span className="nav-sep-dot" />}

            {user && navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`nav-link ${isActive(link.path)}`}>
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="nav-actions">

            {/* Cart — buyers only */}
            {user?.role !== "seller" && (
              <Link to="/cart" className="nav-cart" onClick={handleCartClick}>
                <IconCart />
                {user && cart?.totalItems > 0 && (
                  <span className="nav-cart-badge">{cart.totalItems}</span>
                )}
              </Link>
            )}

            {!user ? (
              <>
                <Link to="/login"    className="nav-btn-ghost">Login</Link>
                <Link to="/register" className="nav-btn-primary">Get Started</Link>
              </>
            ) : (
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button className="nav-avatar-btn" onClick={() => setDropdownOpen(p => !p)}>
                  <div className="nav-avatar">{user.fullname?.charAt(0).toUpperCase()}</div>
                  <span className="nav-avatar-name">{user.fullname?.split(" ")[0]}</span>
                  <IconChevron className={dropdownOpen ? "open" : ""} />
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <div className="nav-dropdown-name">{user.fullname}</div>
                      <div className="nav-dropdown-role">{user.role}</div>
                    </div>

                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="nav-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {link.icon} {link.label}
                      </Link>
                    ))}

                    <div className="nav-dropdown-divider" />

                    <button className="nav-dropdown-item" onClick={() => openModal('profile')}>
                      <IconProfile /> Profile
                    </button>
                    <button className="nav-dropdown-item" onClick={() => openModal('address')}>
                      <IconAddress /> Saved Addresses
                    </button>

                    <div className="nav-dropdown-divider" />

                    <button className="nav-dropdown-item danger" onClick={handleLogout}>
                      <IconLogout /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button className="nav-mobile-toggle" onClick={() => setDrawerOpen(true)}>
              <IconMenu />
            </button>
          </div>

        </nav>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div className="nav-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="nav-drawer">
            <div className="nav-drawer-head">
              <Link
                to={user ? (isSeller ? "/seller/dashboard" : "/books") : "/"}
                className="nav-logo"
                onClick={() => setDrawerOpen(false)}
              >
                <div className="nav-logo-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <span className="nav-logo-text">Book<span>Store</span></span>
              </Link>
              <button className="nav-drawer-close" onClick={() => setDrawerOpen(false)}>
                <IconClose />
              </button>
            </div>

            {user && (
              <div className="nav-drawer-user">
                <div className="nav-drawer-avatar">{user.fullname?.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="nav-drawer-uname">{user.fullname}</div>
                  <div className="nav-drawer-urole">{user.role}</div>
                </div>
              </div>
            )}

            <div className="nav-drawer-links">
              {!isSeller && (
                <>
                  <Link to="/" className={`nav-drawer-link ${isActive("/")}`} onClick={() => setDrawerOpen(false)}>
                    <IconHome /> Home
                  </Link>
                  <Link to="/books" className={`nav-drawer-link ${isActive("/books")}`} onClick={() => setDrawerOpen(false)}>
                    <IconBooks /> Books
                  </Link>
                </>
              )}

              {user && navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-drawer-link ${isActive(link.path)}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.icon} {link.label}
                </Link>
              ))}

              {/* Cart in drawer — buyers only */}
              {user?.role !== "seller" && (
                <Link
                  to="/cart"
                  className={`nav-drawer-link ${isActive("/cart")}`}
                  onClick={(e) => {
                    setDrawerOpen(false);
                    if (!user) {
                      e.preventDefault();
                      toast.info("Please login to view your cart");
                      navigate("/login");
                    }
                  }}
                >
                  <IconCart />
                  Cart {user && cart?.totalItems > 0 && `(${cart.totalItems})`}
                </Link>
              )}

              {user && (
                <>
                  <div className="nav-drawer-sep" />
                  <button className="nav-drawer-link" onClick={() => openModal('profile')}>
                    <IconProfile /> Profile
                  </button>
                  <button className="nav-drawer-link" onClick={() => openModal('address')}>
                    <IconAddress /> Saved Addresses
                  </button>
                  <div className="nav-drawer-sep" />
                  <button className="nav-drawer-link danger" onClick={handleLogout}>
                    <IconLogout /> Logout
                  </button>
                </>
              )}
            </div>

            {!user && (
              <div className="nav-drawer-auth">
                <Link to="/login"    className="nav-drawer-auth-btn outline" onClick={() => setDrawerOpen(false)}>Login</Link>
                <Link to="/register" className="nav-drawer-auth-btn filled"  onClick={() => setDrawerOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {activeModal === 'profile' && (
        <ProfileModal user={user} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'address' && (
        <AddressModal onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}